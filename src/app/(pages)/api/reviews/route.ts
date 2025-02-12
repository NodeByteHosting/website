import { NextResponse } from "next/server";
import { load } from "cheerio";
import axios from "axios";

/**
 * API ROUTE TO SCRAPE REVIEWS FROM TRUST PILOT
 */
export async function GET() {
    try {
        const reviews = await ScrapeReviews();

        return NextResponse.json({
            status: "OK",
            reviews: reviews,
            code: 200
        });
    } catch (err: any) {
        return NextResponse.json({
            status: "ERROR",
            message: err.message,
            code: 500
        });
    }
}

const ScrapeReviews = async () => {
    const { data } = await axios.get("https://uk.trustpilot.com/review/nodebyte.host");
    const $ = load(data);

    const reviews: {
        title: string,
        content: string,
        reviewer: string,
        reviewer_img: string,
        rating_img: string,
        date: string
    }[] = [];

    $('.styles_reviewCardInner__EwDq2').each((index, element) => {
        const title = $(element).find('[data-service-review-title-typography="true"]').text().trim() || 'No title';
        const content = $(element).find('[data-service-review-text-typography="true"]').text().trim() || 'No content';
        const reviewer = $(element).find('[data-consumer-name-typography="true"]').text().trim() || 'Anonymous';

        // Extract image src and data-src
        let reviewer_img = $(element)
            .find('.avatar_imageWrapper__8wdWb img')
            .filter(function () {
                return $(this).attr('data-consumer-avatar-image') === "true";
            })
            .attr('src') || '/default_user.png';

        const reviewer_img_data_src = $(element)
            .find('.avatar_imageWrapper__8wdWb img')
            .attr('data-src') || '/default_user.png';

        console.log(`Reviewer image src: ${reviewer_img}`);
        console.log(`Reviewer image data-src: ${reviewer_img_data_src}`);

        if (reviewer_img && reviewer_img.startsWith('data:image/')) {
            console.log("Base64 image found, using default user image.");
            reviewer_img = '/default_user.png';
        }

        if (reviewer_img === '/default_user.png' && reviewer_img_data_src && !reviewer_img_data_src.startsWith('data:image/')) {
            console.log("Using lazy-loaded image: " + reviewer_img_data_src);
            reviewer_img = reviewer_img_data_src;
        }

        const rating_img = $(element).find('.star-rating_starRating__4rrcf img').attr('src') || '/default_rating.png';

        const date = $(element).find('[data-service-review-date-of-experience-typography="true"]').text().trim() || 'No date';

        reviews.push({
            title,
            content,
            reviewer,
            reviewer_img,
            rating_img,
            date
        });
    });

    return reviews;
};