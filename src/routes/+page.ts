import { list } from "$lib/images/image_key";
import type { PageLoad } from "./$types";

import img0 from '$lib/images/20221014_180336.jpg';
import img1 from '$lib/images/20221228_173444.jpg';
import img2 from '$lib/images/20230223_144043.jpg';
import img3 from '$lib/images/20230305_163844.jpg';
import img4 from '$lib/images/20230308_090008.jpg';
import img5 from '$lib/images/20230308_162207.jpg';
import img6 from '$lib/images/20230308_175559.jpg';
import img7 from '$lib/images/20230309_180818.jpg';
import img8 from '$lib/images/20230331_211119.jpg';
import img9 from '$lib/images/20230703_195351.jpg';
import img10 from '$lib/images/20230713_175429.jpg';
import img11 from '$lib/images/20230728_193322.jpg';
import img12 from '$lib/images/IMG_0245.jpg';
import img13 from '$lib/images/IMG_3797.jpg';
import img14 from '$lib/images/IMG_20230805_135427_771.jpg';
import img15 from '$lib/images/IMG_20230805_135427_808.jpg';
import img16 from '$lib/images/IMG_20230805_135427_829.jpg';
import img17 from '$lib/images/IMG_20230805_135427_858.jpg';
import img18 from '$lib/images/IMG_20230805_135427_933.jpg';
import img19 from '$lib/images/IMG_20230805_135427_991.jpg';
import img20 from '$lib/images/Screenshot_20230318_132839_Snapchat.jpg'; 

export const load:PageLoad = ({params}) => {

    return {list: list};
}
