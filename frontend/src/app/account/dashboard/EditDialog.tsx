import React, { useEffect, useState } from 'react'
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import * as Yup from "yup";
import { useFormik } from "formik";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import Dropdown from "@/components/common/Dropdown";
import toast from "react-hot-toast";
import axios from "axios";
import Error from "@/components/error/ErrorMessage";
import Cookies from "js-cookie";
type ValuesType = {
    title: string;
    price: string;
    desc: string;
    condition: string;
    category: string;
    size: string;
    tag: string;
};

interface Data {
    id: number;
    title: string;
    status: string;
    size: string;
    tag: string;
    price: number;
    desc: string;
    condition: string;
    category: string;
    createdAt: string;
    actions: string;
}

type ModalType = {
    openModal: boolean;
    selectedProduct: Data | null;
    setOpenModal: (modal: boolean) => void;
    setSelectedProduct: (modal: null) => void;
}

export const EditDialog = ({ openModal, selectedProduct, setOpenModal, setSelectedProduct }: ModalType) => {
    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedProduct(null);
    };

    const apiUrl = process.env.API_URL;
    const [error, setError] = useState<Array<string[]> | null | string>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [tag, setTag] = useState<string>("");
    const [size, setSize] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    useEffect(() => {
        if (selectedProduct) {

            setCategory(selectedProduct.category)
            setTag(selectedProduct.tag)
            setSize(selectedProduct.size)
        }
    }, [selectedProduct])
    const handleSubmit = async (values: ValuesType) => {
        const token = Cookies.get("token");
        if (!selectedProduct) {
            setError("Selected product is null.");
            return;
        }
        try {
            setLoading(true);
            setError(null);

            await axios.patch(
                `${apiUrl}/products/${selectedProduct.id}`,
                values,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            setLoading(false);
            toast.success("Editted Successfully.");

            formik.resetForm();
        } catch (err) {
            setLoading(false);
            if (axios.isAxiosError(err)) {
                const msg = err?.response?.data?.message;
                setError(msg || "An error occurred while uploading the image.");
            }
        }
    };


    const Schema = Yup.object().shape({
        title: Yup.string().required("Name is required"),
        price: Yup.string().required("Price is required"),
        desc: Yup.string().required("Description is required"),
        condition: Yup.string().required("Condition is required"),
        category: Yup.string().required("Category is required"),
        size: Yup.string().required("Size is required"),
        tag: Yup.string().required("Tag is required"),
    });

    const formValues: ValuesType = {
        title: selectedProduct ? selectedProduct.title : "",
        price: selectedProduct ? selectedProduct.price.toString() : "",
        desc: selectedProduct ? selectedProduct.desc : "",
        condition: selectedProduct ? selectedProduct.condition : "",
        category: category,
        size: size,
        tag: tag,
    };

    const formik = useFormik({
        initialValues: formValues,
        validationSchema: Schema,
        onSubmit: handleSubmit,
        enableReinitialize: true, // This allows the form to reinitialize when selectedProduct changes
    });



    return (
        <div>
            <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="md">
                <div className="flex justify-between font-sans">
                    <DialogTitle>
                        <div className="font-sans">
                            Edit Product
                        </div>
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={handleCloseModal} >X</Button>
                    </DialogActions>
                </div>
                <DialogContent>
                    <div className="md:px-1 flex flex-col  gap-5 md:gap-10">
                        <form
                            onSubmit={formik.handleSubmit}
                            className="flex w-full flex-col gap-4 md:gap-7"
                        >
                            <div className="grid w-full grids-cols-1 md:grid-cols-2 md:gap-5">
                                <Input
                                    type="text"
                                    label="Name"
                                    placeHolder="Name"
                                    require={true}
                                    name="title"
                                    value={formik.values.title}
                                    error={formik.touched.title && formik.errors.title}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                />
                                <Input
                                    type="text"
                                    label="Price"
                                    placeHolder="Price"
                                    require={true}
                                    name="price"
                                    value={formik.values.price}
                                    error={formik.touched.price && formik.errors.price}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                />

                                <Dropdown
                                    header="Size"
                                    label="Size"
                                    editDrop={size}
                                    data={[
                                        { name: "extra small (XS)" },
                                        { name: "small (S)" },
                                        { name: "medium (M)" },
                                        { name: "large (L)" },
                                        { name: "extra large (XL)" },
                                        { name: "XXL" },
                                        { name: "XXXL" },
                                        { name: "4XL" },
                                        { name: "5XL" },
                                    ]}
                                    required={true}
                                    error={formik.touched.size && formik.errors.size}
                                    onChange={(selectedSize) => {
                                        setSize(selectedSize);
                                        formik.setFieldValue("size", selectedSize);
                                    }}
                                    onBlur={formik.handleBlur}
                                />
                                <Dropdown
                                    header="Tags"
                                    label="Tags"
                                    editDrop={tag}
                                    data={[
                                        { name: "T-shirt" },
                                        { name: "top" },
                                        { name: "trouser" },
                                        { name: "dress" },
                                        { name: "skirt" },
                                        { name: "accessories" },
                                    ]}
                                    required={true}
                                    error={formik.touched.tag && formik.errors.tag}
                                    onChange={(selectedTag) => {
                                        setTag(selectedTag);
                                        formik.setFieldValue("tag", selectedTag);
                                    }}
                                    onBlur={formik.handleBlur}
                                />
                                <Dropdown
                                    header="Category"
                                    editDrop={category}
                                    label="Category"
                                    data={[{ name: "women" }, { name: "men" }, { name: "accessories" }]}
                                    required={true}
                                    error={formik.touched.category && formik.errors.category}
                                    onChange={(selectedCategory) => {
                                        setCategory(selectedCategory);
                                        formik.setFieldValue("category", selectedCategory);
                                    }}
                                    onBlur={formik.handleBlur}
                                />
                                <Input
                                    type="text"
                                    label="Condition"
                                    placeHolder="Slightly Used"
                                    require={true}
                                    name="condition"
                                    value={formik.values.condition}
                                    error={formik.touched.condition && formik.errors.condition}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                />
                                <div
                                    className="w-full cols-s
        md:col-span-2"
                                >
                                    <Textarea
                                        label="Description"
                                        placeHolder="Description"
                                        require={true}
                                        name="desc"
                                        disabled={false}
                                        value={formik.values.desc}
                                        error={formik.touched.desc && formik.errors.desc}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                    />
                                </div>
                            </div>
                            {error && <Error error={error} />}
                            <button
                                className="w-full md:w-1/3 mx-auto text-white flex items-center justify-center cursor-pointer rounded-sm py-2.5 px-5 bg-primaryColor-100"
                                type="submit"
                            >
                                {loading ? "Editing...." : "Edit"}
                            </button>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

