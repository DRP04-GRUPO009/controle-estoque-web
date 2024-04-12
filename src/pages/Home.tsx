import { useAuth } from "../context/useAuth";
import Sidebar from "../components/sidebar/Sidebar";

export default function Home() {
    const { user } = useAuth();

    return (
        <>
            <div className="flex flex-row">
                <Sidebar />
                <div className="w-10/12 p-5">
                    <h1 className="text-4xl">Bem vindo(a), {user?.firstName} </h1>
                </div>
            </div>
        </>
    );
}