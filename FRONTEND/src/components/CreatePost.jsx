import React, { useRef, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { readFileAsDataURL } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';


const CreatePost = ({ open, setOpen }) => {
    const fileRef = useRef("");
    const [file, setFile] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [caption, setCaption] = useState("");
    const [loading, setLoading] = useState (false);
    const {posts} = useSelector (store => store.posts)
    const dispatch = useDispatch ();

    const captionHandler = (e) => {
        const cap = e.target.value;
        setCaption(cap.trim() ? cap : "");
    }

    const fileHandler = async (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setFile(file);
            const dataURL = await readFileAsDataURL(file);
            setImagePreview(dataURL);
        }
    }

    const sendPostHandler = async () => {
        try {
            setLoading (true);
            // console.log('File going: ', file);
            // console.log('Caption going: ', caption);
            const form = new FormData();
            form.append("caption", caption);
            if (imagePreview) form.append("image", file);
            // console.log ('image appended...')

            const data = await fetch('http://localhost:8000/api/v1/post/addpost', {
                method: "POST",
                body: form,
                credentials: 'include'
            });
            // console.log ('fetch executed')
            const data1 = await data.json();
            // console.log ('converted to data.json()');
            console.log('Data: ', data1);
            if (data1.success) {
                //Toast
                setOpen(false)
                setCaption ("");
                setFile ("")
                setImagePreview ("")
                dispatch (setPosts([data1.post, ...posts]));
            }
        } catch (error) {
            console.log(error);
            //Toast
        } finally {
            setLoading (false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                onInteractOutside={() => setOpen(false)}
                className="w-full max-w-2xl p-8 rounded-2xl shadow-2xl bg-white dark:bg-zinc-900 space-y-6"
            >
                <DialogTitle></DialogTitle>
                <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                    Share a Photo or Video
                </h2>

                {/* Hidden file input */}
                <input ref={fileRef} type="file" hidden onChange={fileHandler} />

                {/* Image preview */}
                {imagePreview && (
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full max-h-[500px] object-contain rounded-xl border border-zinc-200 dark:border-zinc-700"
                    />
                )}

                {/* Caption box */}
                {imagePreview && (
                    <textarea
                        value={caption}
                        onChange={captionHandler}
                        placeholder="Add a caption..."
                        rows={2}
                        className="w-full resize-none rounded-md border px-3 py-2 text-sm text-zinc-800 dark:text-zinc-100 dark:bg-zinc-800 placeholder-zinc-400 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-4 pt-4">
                    {!imagePreview ? (
                        <button
                            onClick={() => fileRef.current.click()}
                            className="px-6 py-3 rounded-lg bg-blue-600 text-white text-base font-semibold hover:bg-blue-700 transition"
                        >
                            Select from computer
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={sendPostHandler}
                                className="px-6 py-3 rounded-lg bg-blue-600 text-white text-base font-semibold hover:bg-blue-700 transition"
                            >
                                {loading ? "Posting..." : "Post"}
                            </button>
                            <button
                                onClick={() => {
                                    setImagePreview("")
                                    setCaption ("")
                                    setFile ("")
                                }}
                                className="px-6 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 text-base text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreatePost;