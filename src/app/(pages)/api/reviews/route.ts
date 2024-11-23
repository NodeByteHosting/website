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
        const reviewer_img = $(element).find('.avatar_imageWrapper__8wdWb img').last().attr('src') || '/default_user.png';
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