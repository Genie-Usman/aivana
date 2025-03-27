"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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
        console.log(values);
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

    const inputHandler = debounce((fieldName, value, type, onChange) => {
        setNewTransformation((prevState) => ({
            ...prevState,
            [type]: {
                ...prevState?.[type],
                [fieldName === "prompt" ? "prompt" : "to"]: value,
            },
        }));
        return onChange(value);
    }, 500);

    const transformHandler = () => {
        setIsTransforming(true);

        setTransformationConfig(deepMergeObjects(newTransformation, transformationConfig));

        setNewTransformation(null);
        startTransition(async () => {
            await updateCredits(userId, creditFee);
        });
    };

    useEffect(() => {
        if(image && (type === 'restore' || type === 'removeBackground')) {
          setNewTransformation(transformationType.config)
        }
      }, [image, transformationType.config, type])

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 p-6 bg-white shadow-lg rounded-xl"
            >
                {creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal />}
                <CustomField
                    control={form.control}
                    name="title"
                    formLabel="Image Title"
                    render={({ field }) => (
                        <Input {...field} placeholder="Enter image title" className="rounded-[16px] border-2 border-[#BCB6FF]/20 shadow-sm shadow-[#BCB6FF]/15 text-[#2B3674] disabled:opacity-100 font-semibold text-[16px] leading-[140%] h-[50px] md:h-[54px] focus-visible:ring-offset-0 px-4 py-3 focus-visible:ring-transparent" />
                    )}
                />

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
                                <SelectTrigger className="w-full border-2 border-[#BCB6FF]/20 shadow-sm shadow-[#BCB6FF]/15 rounded-[16px] h-[50px] md:h-[54px] text-[#2B3674] font-semibold text-[16px] leading-[140%] disabled:opacity-100 placeholder:text-[#7986AC]/50 px-4 py-3 focus:ring-offset-0 focus-visible:ring-transparent focus:ring-transparent focus-visible:ring-0 focus-visible:outline-none bg-white">
                                    <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-gray-200 shadow-md rounded-lg">
                                    {Object.keys(aspectRatioOptions).map((key) => (
                                        <SelectItem key={key} value={key} className="py-3 cursor-pointer hover:bg-[#F4F7FE]">
                                            {aspectRatioOptions[key].label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                )}

                {(type === "remove" || type === "recolor") && (
                    <div className="flex flex-col gap-5 lg:flex-row lg:gap-10">
                        <CustomField
                            control={form.control}
                            name="prompt"
                            formLabel={
                                type === "remove" ? "Object to remove" : "Object to recolor"
                            }
                            className="w-full"
                            render={({ field }) => (
                                <Input
                                    value={field.value}
                                    className="rounded-[16px] border-2 border-[#BCB6FF]/20 shadow-sm shadow-[#BCB6FF]/15 text-[#2B3674] disabled:opacity-100 font-semibold text-[16px] leading-[140%] h-[50px] md:h-[54px] focus-visible:ring-offset-0 px-4 py-3 focus-visible:ring-transparent"
                                    onChange={(e) => inputHandler(
                                        'prompt',
                                        e.target.value,
                                        type,
                                        field.onChange
                                    )}
                                />
                            )}
                        />
                    </div>
                )}

                {type === "recolor" && (
                    <CustomField
                        control={form.control}
                        name="color"
                        formLabel="Replacement Color"
                        className="w-full"
                        render={({ field }) => (
                            <Input
                                value={field.value}
                                className="rounded-[16px] border-2 border-[#BCB6FF]/20 shadow-sm shadow-[#BCB6FF]/15 text-[#2B3674] disabled:opacity-100 font-semibold text-[16px] leading-[140%] h-[50px] md:h-[54px] focus-visible:ring-offset-0 px-4 py-3 focus-visible:ring-transparent"
                                onChange={(e) => inputHandler(
                                    'color',
                                    e.target.value,
                                    "recolor",
                                    field.onChange
                                )}
                            />
                        )}
                    />
                )}

                <div className="grid h-fit min-h-[200px] grid-cols-1 gap-5 py-4 md:grid-cols-2">
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
                                className="border rounded-lg"
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
                        className="rounded-lg shadow-md"
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <Button
                        type="button"
                        className="bg-[url('/assets/images/gradient-bg.svg')] bg-cover rounded-full py-4 px-6 font-semibold text-[16px] leading-[140%]h-[50px] w-full md:h-[54px] text-white capitalize"
                        onClick={transformHandler}
                        disabled={isTransforming || newTransformation === null}
                    >
                        {isTransforming ? "Transforming..." : "Apply Transformation"}
                    </Button>

                    <Button type="submit" disabled={isSubmitting} className="bg-[url('/assets/images/gradient-bg.svg')] bg-cover rounded-full py-4 px-6 font-semibold text-[16px] leading-[140%]h-[50px] w-full md:h-[54px] text-white capitalize">
                        {isSubmitting ? "Saving..." : "Save Image"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default TransformationForm;
