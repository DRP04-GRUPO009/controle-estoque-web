import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import { useAuth } from "../context/useAuth";
import { SchoolUnit } from "../interfaces/models/SchoolUnit";
import { useEffect, useState } from "react";
import { UnitTypeEnum } from "../interfaces/enums/UnitTypeEnum";
import { ChevronUpDownIcon, ArrowUpTrayIcon, ArrowDownTrayIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { getSchoolUnitById } from "../services/schoolUnitService";
import { updateStockItem } from "../services/stockItemService";
import axios from "axios";

export type StockItemFormInputs = {
  quantity: number,
  stock: number,
  product: number
}

export default function EditStock() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [schoolUnit, setSchoolUnit] = useState<SchoolUnit | null>(null);
  const [editedQuantity, setEditedQuantity] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchSchoolUnitById = async () => {
      const schoolUnit = await getSchoolUnitById(id ? Number.parseInt(id) : 0);
      if (schoolUnit) setSchoolUnit(schoolUnit);
    };

    fetchSchoolUnitById();
  }, [id]);

  const handleEditQuantity = (id: number, value: string) => {
    setEditedQuantity({
      ...editedQuantity,
      [id]: value
    });
  };

  const handleUpdateStockItemQuantity = async (id: number) => {
    const quantity = editedQuantity[id];
    const stockItem = schoolUnit?.stock.items.find(i => i.id === id);

    if (stockItem) {
      const item: StockItemFormInputs = {
        product: stockItem.product.id,
        quantity: Number.parseInt(quantity),
        stock: stockItem.stock
      }

      const response = await updateStockItem(stockItem.id, item);
      if (response === axios.HttpStatusCode.Ok) {
        window.alert("Quantidade do item alterada com sucesso");
        navigate(`/gerenciamento/unidades-escolares/${schoolUnit?.stock.school_unit}/estoque`);
      }
      else window.alert(`Ocorreu um erro ao tentar alterar a quantidade do item. Código: ${response}`);
    }

  };

  return (
    <>
     <div className="flex flex-row">
        <Sidebar />
        {schoolUnit ? (
          <div className="w-10/12 p-5">
            <h2 className="text-3xl">Estoque: {schoolUnit.name}</h2>
            <div className="flex mt-5">
              <button
                type="button"
                className="flex items-center bg-[#1C2434] hover:opacity-90 text-white font-bold mx-2 py-2 px-4 w-42 rounded">
                <ArrowDownTrayIcon className="h-6 w-6 mr-3" />
                Receber Produtos
              </button>
              <button
                type="button"
                className="flex items-center bg-[#1C2434] hover:opacity-90 text-white font-bold mx-2 py-2 px-4 w-42 rounded">
                <ArrowUpTrayIcon className="h-6 w-6 mr-3" />
                Enviar Produtos
              </button>   
            </div>

            <div>

            </div>
            <hr />
            <div className="mt-5">
              <h3 className="text-2xl">Produtos Disponíveis</h3>
              <table
                  className="min-w-full text-left text-sm font-light bg-white overflow-hidden shadow rounded-lg border mt-5">
                  <thead
                    className="border-b border-[#1C2434] font-medium dark:border-white/10">
                    <tr>
                      <th scope="col" className="px-6 py-4">Item</th>
                      <th scope="col" className="px-6 py-4">Produto</th>
                      <th scope="col" className="px-6 py-4">Unidade de Medida</th>
                      <th scope="col" className="px-6 py-4">Quantidade</th>
                      {user?.isStaff ? (<th scope="col" className="px-6 py-4">Ações</th>) : ''}
                    </tr>
                  </thead>
                  <tbody>                
                    {schoolUnit.stock.items.map((item) => (
                      <tr className="" key={item.id}>
                        <td className="px-6 py-4">{item.id}</td>
                        <td className="px-6 py-4">{item.product.name}</td>
                        <td className="px-6 py-4">{UnitTypeEnum[item.product.unit_type.valueOf()]}</td>
                        {user?.isStaff ? (
                            <td>
                                <input 
                                type="number"
                                id={`item-${item.id}-quantity`}
                                min={0}
                                defaultValue={item.quantity}
                                onChange={(e) => handleEditQuantity(item.id, e.target.value)}

                                />
                            </td>
                        ) : (
                          <td className="px-6 py-4">{item.quantity}</td>
                        )}
                        {user?.isStaff ? (                         
                          <td className="px-6 py-4">
                            <button
                              type="button"
                              className="flex items-center bg-[#1C2434] hover:opacity-90 text-white font-bold mx-2 py-2 px-4 w-42 rounded disabled:cursor-not-allowed"
                              onClick={() => handleUpdateStockItemQuantity(item.id)}
                              >
                              <ChevronUpDownIcon className="mr-2 h-6 w-6" />
                              Atualizar Quantidade
                            </button>                       
                          </td>                        
                          ) : ''
                        }
                      </tr>
                    ))}
                  </tbody>
              </table>
            </div>

            <Link to={'/gerenciamento'} className="inline-block">
              <button
                type="button"
                className="flex items-center bg-[#1C2434] hover:opacity-90 text-white font-bold mt-5 py-2 px-4 mx-3 w-32 rounded">
                <ArrowUturnLeftIcon className="h-6 w-6 mr-3" />
                Voltar
              </button>
            </Link> 
          </div>
        ) : (
          ''
        )}
      </div>
    </>
  );
}