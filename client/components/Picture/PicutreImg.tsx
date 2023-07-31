import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useState, useEffect } from 'react';

interface PictureImgProps {
    imgSrc: string;
    size: string;
    width?: number;
}

const PictureImg = ({ imgSrc, size, width }: PictureImgProps) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const image = new Image();
        image.src = `${imgSrc}-${size}.webp`;

        image.onload = () => {
            setIsLoading(false);
        };
        return () => {
            image.onload = null;
        };
    }, [imgSrc, size]);

    useEffect(() => {
        console.log(isLoading);
    }, [isLoading]);

    return (
        <picture>
            {isLoading ? (
                <img src="/img/Loading.gif" alt="병 사진" />
            ) : (
                <>
                    <source srcSet={`${imgSrc}-${size}.webp`} type="image/webp" />
                    <source srcSet={`${imgSrc}-${size}.jpg`} type="image/jpeg" />
                    <img
                        src={`${imgSrc}-${size}.jpg`}
                        alt="병 사진"
                        width={`${width}px`}
                        style={{ borderRadius: '0.6rem' }}
                        loading="lazy"
                    />
                </>
            )}
        </picture>
    );
};

export default PictureImg;
