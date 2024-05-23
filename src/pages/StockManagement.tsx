import { Link } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import { HomeModernIcon, TableCellsIcon } from "@heroicons/react/24/solid";

export default function StockManagement() {
  return (
    <>
      <div className="flex flex-row">
        <Sidebar />
        <div className="w-10/12 p-5">
          <div className="flex flex-row justify-center m-10">
            <Link to={'/gerenciamento/unidades-escolares'} aria-label="Acessar a área de gerenciamento das unidades escolares">
              <div className="flex flex-col bg-[#247ba0] text-[#f2f2f2] text-center hover:opacity-75 rounded overflow-hidden shadow-lg p-3 mx-5 w-44 h-52">
                <div className="flex p-6 justify-center">
                  <HomeModernIcon className="h-22 w-22" aria-hidden="true" />
                </div>
                <p>Unidades Escolares</p>
             </div>
            </Link>
            <Link to={'/gerenciamento/estoques'} aria-label="Acessar a área de gerenciamento dos estoques">
              <div className="flex flex-col bg-[#247ba0] text-[#f2f2f2] text-center hover:opacity-75 rounded overflow-hidden shadow-lg p-3 mx-5 w-44 h-52">
                <div className="flex p-6 justify-center">
                  <TableCellsIcon className="h-22 w-22" aria-hidden="true" />
                </div>
                <p>Estoques</p>
             </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}