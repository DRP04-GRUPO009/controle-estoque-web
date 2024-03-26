import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { useAuth } from "../context/useAuth";
import { SchoolUnit } from "../interfaces/models/SchoolUnit";
import { deleteSchoolUnit, getAllSchoolsUnits } from "../services/schoolUnitService";
import { Link } from "react-router-dom";
import axios from "axios";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";

export default function SchoolsUnits() {
  const { user } = useAuth();
  const [schoolsUnits, setSchoolsUnits] = useState<SchoolUnit[] | null>(null);

  const fetchScholsUnits = async () => {
    const schoolsUnits = await getAllSchoolsUnits();
    if (schoolsUnits) setSchoolsUnits(schoolsUnits);
  }

  useEffect(() => {
    fetchScholsUnits();
  }, []);

  const handleDeleteSchoolUnit = async (id: number) => {
    const confirmed = window.confirm('Tem certeza que deseja excluir essa unidade escolar?');
    if (confirmed) {
      const response = await deleteSchoolUnit(id);
      if (response?.status === axios.HttpStatusCode.NoContent) window.alert('Unidade escolar excluída com sucesso!'); 
      else window.alert('Ocorreu um erro ao tentar excluir a unidades escolar. Tente mais tarde.');
      fetchScholsUnits();
    }
  }

  return (
    <>
      <div className="flex flex-row">
        <Sidebar />
        <div className="w-10/12 p-5">
        <h2 className="text-3xl">Unidades Escolares</h2>
        {schoolsUnits ? (
          <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden mt-2">
                {user?.isStaff ? (
                  <Link to={'/gerenciamento/unidades-escolares/nova'}>
                    <button
                      type="button"
                      className="bg-[#247BA0] hover:opacity-90 text-white font-bold mx-3 w-24 rounded py-2">
                      Nova
                    </button>
                  </Link>
                ) : ''                  
                }
                <table
                  className="min-w-full text-left text-sm font-light bg-white overflow-hidden shadow rounded-lg border mt-5">
                  <thead
                    className="border-b border-[#1C2434] font-medium dark:border-white/10">
                    <tr>
                      <th scope="col" className="px-6 py-4">Nome da Unidade</th>
                      {user?.isStaff ? (<th scope="col" className="px-6 py-4">Ações</th>) : ''}
                    </tr>
                  </thead>
                  <tbody>                
                    {schoolsUnits.map((schoolUnit) => (
                      <tr className="" key={schoolUnit.stock.school_unit}>
                        <td className="px-6 py-4">{schoolUnit.name}</td>
                        <td className="flex px-3 py-4">
                          <Link to={`${schoolUnit.stock.school_unit}/estoque`}>
                            <button
                              type="button"
                              className="bg-[#1C2434] hover:opacity-90 text-white font-bold py-2 px-4 mx-3 w-24 rounded">
                              Estoque
                            </button>
                          </Link>
                          {user?.isStaff ? (
                            <>
                              <Link to={`${schoolUnit.stock.school_unit}/editar`}>
                                <button
                                  type="button"
                                  className="bg-[#1C2434] hover:opacity-90 text-white font-bold py-2 px-4 mx-3 w-24 rounded">
                                  Editar
                                </button>
                              </Link>
                              <button
                                type="button"
                                className="bg-[#F87171] hover:opacity-90 text-white font-bold py- px-4 mx-3 w-24 rounded"
                                onClick={() => handleDeleteSchoolUnit(schoolUnit.stock.school_unit)} 
                                >
                                Excluir
                            </button>
                            </>
                          ) : (
                            ''
                          )                            
                          }
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
        <Link to={'/gerenciamento'} className="inline-block">
        <button
          type="button"
          className="flex items-center bg-[#1C2434] hover:opacity-90 text-white font-bold mt-5 py-2 px-4 mx-3 rounded">
          <ArrowUturnLeftIcon className="h-6 w-6 mr-3" />
          Voltar
        </button>
        </Link>
        </div>
      </div>
    </>
  );
}
