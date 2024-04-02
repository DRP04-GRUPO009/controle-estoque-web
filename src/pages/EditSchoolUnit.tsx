import Sidebar from "../components/sidebar/Sidebar";
import * as Yup from "yup"
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { SchoolUnit } from "../interfaces/models/SchoolUnit";
import { getSchoolUnitById, updateSchoolUnit } from "../services/schoolUnitService";
import axios from "axios";

export type SchoolUnitFormInputs = {
  name: string,
  main_unit?: boolean
}

const validation = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  main_unit: Yup.boolean()
});

export default function EditProduct() {
  const { id } = useParams();
  const [schoolUnit, setSchoolUnit] = useState<SchoolUnit | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<SchoolUnitFormInputs>({ resolver: yupResolver(validation) });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchoolUnitById = async () => {
      const schoolUnit = await getSchoolUnitById(id ? Number.parseInt(id) : 0);
      if (schoolUnit) setSchoolUnit(schoolUnit);
    };

    fetchSchoolUnitById();
  }, [id]);

  const handleUpdateSchoolUnit = async(form: SchoolUnitFormInputs) => {
    if (id) {
      const response = await updateSchoolUnit(Number.parseInt(id), form);
      if (response === axios.HttpStatusCode.Ok) {
        window.alert('Unidade escolar alterada com sucesso');
        navigate('/gerenciamento/unidades-escolares');
      }
      else window.alert(`Ocorreu um problema ao tentar atualizar a unidade escolar. Código: ${response}`);
    }
  };

  return (
    <>
      <div className="flex flex-row">
        <Sidebar />
        {schoolUnit ? (
          <div className="w-10/12 p-5">
          <h2 className="mb-4 text-3xl text-[#1C2434]">Editar informações da Unidade Escolar: {schoolUnit.name}</h2>
          <section className="bg-white rounded-lg border mt-5">
            <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                <form onSubmit={handleSubmit(handleUpdateSchoolUnit)}>
                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                        <div className="sm:col-span-2">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-[#1C2434] dark:text-white">Nome da Unidade</label>
                            <input 
                              type="text"
                              id="name" 
                              className="bg-gray-50 border border-gray-400 text-[#1C2434] text-sm rounded-lg focus:ring-[#247BA0] focus:border-[#247BA0] block w-full p-2.5" 
                              placeholder="Nome da Unidade" 
                              {...register("name")}
                              defaultValue={schoolUnit.name}
                              />
                              {errors.name ? <p className="text-[#F87171]">{errors.name.message}</p> : ""}
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="isMain" className="mb-2 mr-2 text-sm font-medium text-[#1C2434] dark:text-white">Unidade Principal</label>
                            <input 
                              type="checkbox"
                              id="isMain" 
                              className="bg-gray-50 text-[#1C2434] text-sm rounded-lg focus:ring-[#247BA0] focus:border-[#247BA0]" 
                              placeholder="Nome da Unidade" 
                              {...register("main_unit")}
                              defaultChecked={schoolUnit.main_unit}
                              />
                        </div>
                    </div>
                    <div className="flex justify-end">
                      <Link to={'/gerenciamento/unidades-escolares'} className="inline-block">
                        <button type="button" className="bg-[#1C2434] hover:opacity-90 mt-5 text-[#F5EDF0] font-bold py-2 px-4 mx-3 rounded">
                            Voltar
                        </button>
                      </Link>
                      <button type="submit" className="bg-[#247BA0] hover:opacity-90 mt-5 text-[#F5EDF0] font-bold py-2 px-4 mx-3 rounded">
                          Atualizar
                      </button>
                    </div>
                </form>
            </div>
          </section>
        </div>
        ) : ''}
      </div>
    </>
  );
}
