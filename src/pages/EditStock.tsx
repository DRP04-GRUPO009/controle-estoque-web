import { Link, useParams } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import { useAuth } from "../context/useAuth";
import { SchoolUnit } from "../interfaces/models/SchoolUnit";
import { useEffect, useState } from "react";
import { getSchoolUnitById } from "../services/stockManagementService";
import { UnitTypeEnum } from "../interfaces/enums/UnitTypeEnum";

export default function EditStock() {
  const { id } = useParams();
  const { user } = useAuth();

  const [schoolUnit, setSchoolUnit] = useState<SchoolUnit | null>(null);

  useEffect(() => {
    const fetchSchoolUnitById = async () => {
      const schoolUnit = await getSchoolUnitById(id ? Number.parseInt(id) : 0);
      if (schoolUnit) setSchoolUnit(schoolUnit);
    };

    fetchSchoolUnitById();
  }, [id]);

  return (
    <>
     <div className="flex flex-row">
        <Sidebar />
        {schoolUnit ? (
          <div className="w-10/12 p-5">
            <h2 className="text-3xl">Estoque: {schoolUnit.name}</h2>
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
                        <td className="px-6 py-4">{item.quantity}</td>
                        <td className="flex px-3 py-4">
                          {/* acoes */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Link to={'/gerenciamento'}>
                  <button
                    type="button"
                    className="bg-[#1C2434] hover:opacity-90 text-white font-bold mt-5 py-2 px-4 mx-3 w-24 rounded">
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