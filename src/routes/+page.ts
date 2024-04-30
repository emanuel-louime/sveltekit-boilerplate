import { list } from "$lib/images/image_key";
import type { PageLoad } from "./$types";

export const load:PageLoad = ({params}) => {

    return {list: list};
}
