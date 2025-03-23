"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { aspectRatioOptions, defaultValues } from "../../constants";
import { CustomField } from "./CustomField";
import { transformationTypes } from "../../constants";
import { useState, useTransition } from "react";
import { debounce, deepMergeObjects } from "@/lib/utils";
import MediaUploader from "./MediaUploader";

export const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    aspectRatio: z.string().optional(),
    color: z.string().optional(),
    prompt: z.string().optional(),
    publicId: z.string().min(1, "Public ID is required"),
});

const TransformationForm = ({ action, data = null, userId, type, creditBalance, config = null }) => {
    const transformation = transformationTypes[type];
    const [image, setImage] = useState(data)
    const [newTransformation, setNewTransformation] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [transforming, setTransforming] = useState(false)
    const [transformationConfig, setTransformationConfig] = useState(config)
    const [isPending, startTransition] = useTransition()

    const initialValues = data && action === "Update"
        ? {
            title: data?.title || "",
            aspectRatio: data?.aspectRatio || "",
            color: data?.color || "",
            prompt: data?.prompt || "",
            publicId: data?.publicId || "",
        }
        : defaultValues;

    // Define form using react-hook-form
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues,
    });

    // Submit handler
    const onSubmit = (values) => {
        console.log("Form submitted:", values);
    }

    const selectHandler = (value, onChange) => {
        const imageSize = aspectRatioOptions[value]
        setImage((prevState) => ({
            ...prevState,
            aspectRatio: imageSize.aspectRatio,
            width: imageSize.width,
            height: imageSize.height
        }))
        setNewTransformation(transformationTypes.config)
        return onChange(value)
    }
    const inputHandler = (fieldName, value, type, onChange) => {
        debounce(() => {
            setNewTransformation((prevState) => ({
                ...prevState,
                [type]: {
                    ...prevState?.[type],
                    [fieldName === "prompt" ? "prompt" : "to"]:
                        value
                }
            }))
            return onChange(value)
        }, 1000)
    }
    const transformHandler = () => {
        setTransforming(true)
        setTransformationConfig(
            deepMergeObjects(newTransformation, transformationConfig)
        )
        setNewTransformation(null)
        startTransition(async ()=>{
            // await updateCredits(userId, creditFee)
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Title Field */}
                <CustomField
                    control={form.control}
                    name="title"
                    formLabel="Image Title"
                    render={({ field }) => (
                        <Input {...field} placeholder="Enter image title" className="rounded-[16px] border-2 border-[#BCB6FF]/20 shadow-sm shadow-[#BCB6FF]/15 text-[#2B3674] disabled:opacity-100 font-semibold text-[16px] leading-[140%] h-[50px] md:h-[54px] focus-visible:ring-offset-0 px-4 py-3 focus-visible:ring-transparent" />
                    )}
                />

                {/* Select Field (Only for "fill" Type) */}
                {type === "fill" && (
                    <CustomField
                        control={form.control}
                        name="aspectRatio"
                        formLabel="Aspect Ratio"
                        className="w-full"
                        render={({ field }) => (
                            <Select onValueChange={(value) => selectHandler(value, field.onChange)}>
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
                            />
                        )}
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <Button
                        type="button"
                        className="bg-[url('/assets/images/gradient-bg.svg')] bg-cover rounded-full py-4 px-6 font-semibold text-[16px] leading-[140%]h-[50px] w-full md:h-[54px] text-white capitalize"
                        disabled={transforming || newTransformation === null}
                        onClick={transformHandler}
                    >{transforming ? "Transforming..." : "Apply Transformation"}</Button>
                    <Button
                        type="submit"
                        className="bg-[url('/assets/images/gradient-bg.svg')] bg-cover rounded-full py-4 px-6 font-semibold text-[16px] leading-[140%]h-[50px] w-full md:h-[54px] text-white capitalize"
                        disabled={submitting}
                    >{submitting ? "Submitting" : "Save Image"}</Button>

                </div>
            </form>
        </Form>
    );
};

export default TransformationForm;