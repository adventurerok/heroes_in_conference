import {ConferenceMap} from "../../../maps/ConferenceMap";
import {AppDispatch} from "../../appStore";
import {API} from 'src/api/API';
import {updateCachedMap} from "./UpdateCachedMap";


export async function updateMap(map: ConferenceMap, image: string | undefined, dispatch: AppDispatch) /* : ConferenceMap, but issue if we say this */ {

    let imageData;
    if(image) {
        imageData = await toDataUrl(image);
    }

    const result = await API.updateMap(map, imageData);
    dispatch(updateCachedMap(result));

    return result;
}

function toDataUrl(url : string): Promise<Blob> {
   const image = new Image();

   const promise = new Promise<Blob>((resolve, reject) => {
        const blobCallback : BlobCallback = blob => {
            if(blob === null) {
                reject("Failed to convert image to jpeg blob");
            } else {
                resolve(blob);
            }
        };

        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if(!ctx) {
                reject("No canvas context support");
                return;
            }

            canvas.height = image.naturalHeight;
            canvas.width = image.naturalWidth;
            ctx.drawImage(image, 0, 0);
            canvas.toBlob(blobCallback, 'image/jpeg', 0.95);
        };
   });

   image.src = url;

   return promise;
}