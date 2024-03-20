import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { useAuth } from "../context/useAuth";
import { SchoolUnit } from "../interfaces/models/SchoolUnit";
import { getAllSchoolsUnits } from "../services/stockManagementService";
import { Link } from "react-router-dom";

export default function Stocks() {
  const { user } = useAuth();
  const [schoolsUnits, setSchoolsUnits] = useState<SchoolUnit[] | null>(null);

  const fetchScholsUnits = async () => {
    const schoolsUnits = await getAllSchoolsUnits();
    if (schoolsUnits) setSchoolsUnits(schoolsUnits);
  }

  useEffect(() => {
    fetchScholsUnits();
  }, []);


  return (
    <>
      <div className="flex flex-row">
        <Sidebar />
        <div className="w-10/12 p-5">
        <h2 className="text-3xl">Estoques das Unidades Escolares</h2>
        {schoolsUnits ? (
          <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden mt-2">
                <table
                  className="min-w-full text-left text-sm font-light bg-white overflow-hidden shadow rounded-lg border mt-5">
                  <thead
                    className="border-b border-[#1C2434] font-medium dark:border-white/10">
                    <tr>
                      <th scope="col" className="px-6 py-4">Nome da Unidade</th>
                      <th scope="col" className="px-6 py-4">Items Cadastrados</th>
                      {user?.isStaff ? (<th scope="col" className="px-6 py-4">Ações</th>) : ''}
                    </tr>
                  </thead>
                  <tbody>                
                    {schoolsUnits.map((schoolUnit) => (
                      <tr className="" key={schoolUnit.stock.school_unit}>
                        <td className="px-6 py-4">{schoolUnit.name}</td>
                        <td className="px-6 py-4">{schoolUnit.stock.items.length}</td>
                        <td className="flex px-3 py-4">
                          <Link to={`/gerenciamento/unidades-escolares/${schoolUnit.stock.school_unit}/estoque`}>
                            <button
                              type="button"
                              className="bg-[#1C2434] hover:opacity-90 text-white font-bold py-2 px-4 mx-3 w-24 rounded">
                              Gerenciar
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        ) : (
          <p>Não há unidades escolares cadastradas.</p>
        )}
        <Link to={'/gerenciamento'}>
          <button
            type="button"
            className="bg-[#1C2434] hover:opacity-90 text-white font-bold mt-5 py-2 px-4 mx-3 w-24 rounded">
            Voltar
          </button>
        </Link>
        </div>
      </div>
    </>
  );
}
