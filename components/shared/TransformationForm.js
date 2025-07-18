"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from "../../constants";
import { CustomField } from "./CustomField";
import { useEffect, useState, useTransition } from "react";
import { debounce, deepMergeObjects } from "../../lib/utils";
import MediaUploader from "./MediaUploader";
import TransformedImage from "./TransformedImage";
import { updateCredits } from "../../lib/actions/User.actions";
import { addImage, updateImage } from "../../lib/actions/Image.actions";
import { getCldImageUrl } from "next-cloudinary";
import { InsufficientCreditsModal } from "./InsufficientCredits";
import { Loader2, Sparkles, Save } from "lucide-react";

export const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    aspectRatio: z.string().optional(),
    color: z.string().optional(),
    prompt: z.string().optional(),
    publicId: z.string().min(1, "Public ID is required"),
});

const TransformationForm = ({ action, data = null, userId, type, creditBalance, config = null }) => {
    const transformationType = transformationTypes[type];
    const router = useRouter();
    const [image, setImage] = useState(data);
    const [newTransformation, setNewTransformation] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTransforming, setIsTransforming] = useState(false);
    const [transformationConfig, setTransformationConfig] = useState(config);
    const [isPending, startTransition] = useTransition();

    const initialValues = data && action === "Update"
        ? {
            title: data?.title || "",
            aspectRatio: data?.aspectRatio || "",
            color: data?.color || "",
            prompt: data?.prompt || "",
            publicId: data?.publicId || "",
        }
        : defaultValues;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues,
    });

    const onSubmit = async (values) => {
        setIsSubmitting(true);

        if (data || image) {
            const transformationUrl = getCldImageUrl({
                width: image?.width || 500,
                height: image?.height || 500,
                src: image?.publicId,
                ...transformationConfig,
            });

            const imageData = {
                title: values.title,
                publicId: image?.publicId,
                transformationType: type,
                width: image?.width || 500,
                height: image?.height || 500,
                config: transformationConfig,
                secureURL: image?.secureURL,
                transformationURL: transformationUrl,
                aspectRatio: values.aspectRatio,
                prompt: values.prompt,
                color: values.color,
            };

            try {
                if (action === "Add") {
                    const newImage = await addImage({
                        image: imageData,
                        userId,
                        path: '/'
                    })

                    if (newImage) {
                        form.reset()
                        setImage(data)
                        router.push(`/transformations/${newImage._id}`)
                    }
                }
                if (action === "Update") {
                    const updatedImage = await updateImage({
                        image: { ...imageData, _id: data._id },
                        userId,
                        path: `/transformations/${data._id}`,
                    });

                    if (updatedImage) {
                        router.push(`/transformations/${updatedImage._id}`);
                    }
                }
            } catch (error) {
                console.error("Error processing image:", error);
            }
        }

        setIsSubmitting(false);
    };

    const selectHandler = (value, onChange) => {
        const imageSize = aspectRatioOptions[value];
        setImage((prevState) => ({
            ...prevState,
            aspectRatio: imageSize.aspectRatio,
            width: imageSize.width,
            height: imageSize.height,
        }));
        setNewTransformation(transformationType.config);
        return onChange(value);
    };

    const inputHandler = (fieldName, value, type, onChange) => {
        debounce(() => {
            setNewTransformation((prevState) => ({
                ...prevState,
                [type]: {
                    ...prevState?.[type],
                    [fieldName === 'prompt' ? 'prompt' : 'to']: value
                }
            }))
        }, 1000)();

        return onChange(value)
    }

    const transformHandler = () => {
        setIsTransforming(true);

        setTransformationConfig(deepMergeObjects(newTransformation, transformationConfig));

        setNewTransformation(null);
        startTransition(async () => {
            await updateCredits(userId, creditFee);
        });
    };

    useEffect(() => {
        if (image && (type === 'restore' || type === 'removeBackground')) {
            setNewTransformation(transformationType.config)
        }
    }, [image, transformationType.config, type])

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 p-8 "
            >
                {creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal />}

                {/* Title Field */}
                <CustomField
                    control={form.control}
                    name="title"
                    formLabel="Image Title"
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="Enter a descriptive title"
                            className="rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:border-[#624CF5] focus:ring-1 focus:ring-[#624CF5]/30 h-12 px-4 font-medium transition-all"
                        />
                    )}
                />

                {/* Aspect Ratio Selector */}
                {type === "fill" && (
                    <CustomField
                        control={form.control}
                        name="aspectRatio"
                        formLabel="Aspect Ratio"
                        className="w-full"
                        render={({ field }) => (
                            <Select
                                onValueChange={(value) => selectHandler(value, field.onChange)}
                                value={field.value}
                            >
                                <SelectTrigger className="w-full rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:border-[#624CF5] focus:ring-1 focus:ring-[#624CF5]/30 h-12 px-4 font-medium transition-all">
                                    <SelectValue placeholder="Select aspect ratio" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-xl">
                                    {Object.keys(aspectRatioOptions).map((key) => (
                                        <SelectItem
                                            key={key}
                                            value={key}
                                            className="px-4 py-3 hover:bg-[#F4F7FE] transition-colors"
                                        >
                                            {aspectRatioOptions[key].label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                )}

                {/* Prompt Fields */}
                {(type === "remove" || type === "recolor") && (
                    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                        <CustomField
                            control={form.control}
                            name="prompt"
                            formLabel={type === "remove" ? "Object to remove" : "Object to recolor"}
                            className="w-full"
                            render={({ field }) => (
                                <Input
                                    value={field.value}
                                    className="rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:border-[#624CF5] focus:ring-1 focus:ring-[#624CF5]/30 h-12 px-4 font-medium transition-all"
                                    placeholder={type === "remove" ? "Enter object to remove" : "Enter object to recolor"}
                                    onChange={(e) => inputHandler('prompt', e.target.value, type, field.onChange)}
                                />
                            )}
                        />

                        {type === "recolor" && (
                            <CustomField
                                control={form.control}
                                name="color"
                                formLabel="Replacement Color"
                                className="w-full"
                                render={({ field }) => (
                                    <Input
                                        value={field.value}
                                        className="rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:border-[#624CF5] focus:ring-1 focus:ring-[#624CF5]/30 h-12 px-4 font-medium transition-all"
                                        placeholder="Red"
                                        onChange={(e) => inputHandler('color', e.target.value, "recolor", field.onChange)}
                                    />
                                )}
                            />
                        )}
                    </div>
                )}

                {/* Image Upload & Preview */}
                <div className="grid gap-6 py-4 md:grid-cols-2">
                    <CustomField
                        control={form.control}
                        name="publicId"
                        className="flex flex-col size-full"
                        render={({ field }) => (
                            <MediaUploader
                                onChange={field.onChange}
                                setImage={setImage}
                                publicId={field.value}
                                image={image}
                                type={type}
                                className="border-2 border-purple-200/20 rounded-[16px] overflow-hidden shadow-lg shadow-purple-200/10"
                            />
                        )}
                    />

                    <TransformedImage
                        image={image}
                        type={type}
                        title={form.getValues().title}
                        isTransforming={isTransforming}
                        setIsTransforming={setIsTransforming}
                        transformationConfig={transformationConfig}
                        className="rounded-[16px] border-2 border-purple-200/20 shadow-lg shadow-purple-200/10 overflow-hidden"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4">
                    <Button
                        type="button"
                        className="bg-[#624CF5] hover:bg-[#513cd6] cursor-pointer rounded-full py-4 px-6 font-semibold text-[16px] leading-[140%] h-[50px] w-full md:h-[54px] text-white flex items-center justify-center gap-2 shadow-md shadow-[#624CF5]/20"
                        onClick={transformHandler}
                        disabled={isTransforming || newTransformation === null}
                    >
                        {isTransforming ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Transforming...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-5 w-5" />
                                Apply Transformation
                            </>
                        )}
                    </Button>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[url('/assets/images/gradient-bg.svg')] bg-cover cursor-pointer rounded-full py-4 px-6 font-semibold text-[16px] leading-[140%] h-[50px] w-full md:h-[54px] text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg shadow-[#624CF5]/20 transition-all duration-300 hover:opacity-95"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5" />
                                Save Image
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default TransformationForm;
