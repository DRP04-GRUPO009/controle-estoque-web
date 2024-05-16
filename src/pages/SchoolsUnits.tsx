/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { useAuth } from "../context/useAuth";
import { deleteSchoolUnit, getAllSchoolsUnitsByPage } from "../services/schoolUnitService";
import { Link } from "react-router-dom";
import axios from "axios";
import { ArrowUturnLeftIcon, TrashIcon, PlusIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { StockItem } from "../interfaces/models/StockItem";
import { SchoolUnitListResponse } from "../interfaces/models/ShoolUnitListResponse";

export default function SchoolsUnits() {
  const PAGE_SIZE = 10;

  const { user } = useAuth();
  const [schoolsUnits, setSchoolsUnits] = useState<SchoolUnitListResponse | null>(null);
  const [page, setPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(1);

  const fetchScholsUnits = async () => {
    const schoolsUnits = await getAllSchoolsUnitsByPage(page);
    if (schoolsUnits) { 
      setSchoolsUnits(schoolsUnits);
      setNumberOfPages(Math.ceil(schoolsUnits.count / PAGE_SIZE));
    }
  }

  const handleUpdatePageNumber = (page: number) => {
    if (page <= 0) page = 1;
    else if (page > numberOfPages) page = numberOfPages;
    setPage(page);
    fetchScholsUnits();
  }

  useEffect(() => {
    fetchScholsUnits();
  }, [page]);

  const handleDeleteSchoolUnit = async (id: number) => {
    const confirmed = window.confirm('Tem certeza que deseja excluir essa unidade escolar?');
    if (confirmed) {
      const schoolUnit = schoolsUnits?.results.find(l => l.stock.school_unit === id);
      if (schoolUnit) {
        const numberOfItems = schoolUnit.stock.items.reduce((acc: number, item: StockItem) => {
          return acc + item.quantity;
        }, 0);

        if (numberOfItems > 0) window.alert("Não é possível excluir esta unidade escolar porque existem itens no estoque com quantidade maior que zero.");
        else {
          const response = await deleteSchoolUnit(id);
          if (response?.status === axios.HttpStatusCode.NoContent) window.alert('Unidade escolar excluída com sucesso!'); 
          else window.alert('Ocorreu um erro ao tentar excluir a unidades escolar. Tente mais tarde.');
          fetchScholsUnits();
        }
      }
      else window.alert('Ocorreu um erro. Tente mais tarde.')
    }
  }

  return (
    <>
      <div className="flex flex-row">
        <Sidebar />
        <div className="w-10/12 p-5">
        {user && user.permissionGroups.length > 0 ? 
          <h2 className="text-3xl">Meu acesso: unidades escolares</h2> :
          <h2 className="text-3xl">Todas as unidades escolares</h2>
        }
        
        {schoolsUnits ? (
          <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden mt-2">
                {user && (user.permissionGroups.length === 0 || user.isStaff)  ? (
                  <Link to={'/gerenciamento/unidades-escolares/nova'}>
                    <button
                      type="button"
                      className="flex items-center justify-center bg-[#247BA0] hover:opacity-90 text-white font-bold mx-3 w-24 rounded py-2">
                      <PlusIcon className="mr-2 h-6 w-6" />
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
                      {user && (user.permissionGroups.length === 0 || user.isStaff) ? (<th scope="col" className="px-6 py-4">Ações</th>) : ''}
                    </tr>
                  </thead>
                  <tbody>                
                    {schoolsUnits.results.map((schoolUnit) => (
                      <tr className="" key={schoolUnit.stock.school_unit}>
                        <td className="px-6 py-3">{schoolUnit.name}</td>
                        <td className="flex px-3 py-3">
                          {user && (user.permissionGroups.length === 0 || user.isStaff) ? (
                            <>
                              <Link to={`${schoolUnit.stock.school_unit}/editar`}>
                                <button
                                  type="button"
                                  className="flex items-center bg-[#1C2434] hover:opacity-90 text-white font-bold py-2 px-4 mx-3 w-42 rounded">
                                  <PencilSquareIcon className="mr-2 h-5 w-5" />
                                  Editar
                                </button>
                              </Link>
                              <button
                                type="button"
                                className="flex items-center bg-[#F87171] hover:opacity-90 text-white font-bold py- px-4 mx-3 w-42 rounded"
                                onClick={() => handleDeleteSchoolUnit(schoolUnit.stock.school_unit)} 
                                >
                                <TrashIcon className="mr-2 h-5 w-5" />
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
                <div className="flex justify-center mt-3">
                  <nav aria-label="Navegação páginas de produtos">
                    <ul className="inline-flex space-x-2">
                      <li><button className="flex items-center justify-center w-10 h-10 text-[#247BA0] transition-colors duration-250 rounded-full focus:shadow-outline hover:bg-[#247BA0be] hover:text-white" onClick={() => handleUpdatePageNumber(page - 1)}>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path></svg></button>
                      </li>
                      {Array.apply(0, Array(numberOfPages + 1)).map(function (_x, i) {
                        if (i === page)
                          return <li><button className="w-10 h-10 text-white transition-colors duration-150 bg-[#247BA0] border border-r-0 border-[#247BA0] rounded-full focus:shadow-outline">{i}</button></li>;
                        else if (i !== page && i != 0)
                          return <li><button className="w-10 h-10 text-[#247BA0] transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-[#247ba0be] hover:text-white" onClick={() => handleUpdatePageNumber(i)}>{i}</button></li>
                      })}

                      <li><button className="flex items-center justify-center w-10 h-10 text-[#247BA0] transition-colors duration-250 bg-white rounded-full focus:shadow-outline hover:bg-[#247ba0be] hover:text-white" onClick={() => handleUpdatePageNumber(page + 1)}>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path></svg></button>
                      </li>
                    </ul>
                  </nav>
                </div>
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
