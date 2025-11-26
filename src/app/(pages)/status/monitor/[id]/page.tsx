import { PageHero } from "components/PageHero";
import MonitorDetail from "components/Layouts/Monitor";
import ButtonScrollProvider from "providers/ButtonScroll";

export default function MonitorPage() {
    return (
        <>
            <ButtonScrollProvider>
                <PageHero
                    title="Monitor Info"
                    text="View real-time status and performance metrics for this monitor."
                />

                <MonitorDetail />
            </ButtonScrollProvider>
        </>
    )
}