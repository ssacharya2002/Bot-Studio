import axios from "axios";
export async function uploadToCloudinary(file: File) {

    try {

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "l8dwafck");

        console.log("upload post started");
        const data = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
        console.log("upload post completed");

        console.log(data.data.secure_url);


        return Promise.resolve({ url: data.data.secure_url })
        // return NextResponse.json({ url: data.data.secure_url });


    } catch (error) {
        console.log("error uploading to cloudinary", error);
        throw new Error("error uploading to cloudinary");
    }



}