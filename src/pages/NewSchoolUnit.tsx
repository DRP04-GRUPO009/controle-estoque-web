import Sidebar from "../components/sidebar/Sidebar";
import * as Yup from "yup"
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { createSchoolUnit } from "../services/schoolUnitService";
import axios from "axios";

export type SchoolUnitFormInputs = {
  name: string,
}

const validation = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
});

export default function EditProduct() {
  const { register, handleSubmit, formState: { errors } } = useForm<SchoolUnitFormInputs>({ resolver: yupResolver(validation) });
  const navigate = useNavigate();

  const handleCreateSchoolUnit = async(form: SchoolUnitFormInputs) => {
      const response = await createSchoolUnit(form);
      if (response === axios.HttpStatusCode.Created) {
        window.alert('Unidade escolar criada com sucesso');
        navigate('/gerenciamento/unidades-escolares');
      }
      else window.alert(`Ocorreu um problema ao tentar criar a unidade escolar. Código: ${response}`);
  };

  return (
    <>
      <div className="flex flex-row">
        <Sidebar />
          <div className="w-10/12 p-5">
          <h2 className="mb-4 text-3xl text-[#1C2434]">Informações da nova Unidade Escolar</h2>
          <section className="bg-white rounded-lg border mt-5">
            <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                <form onSubmit={handleSubmit(handleCreateSchoolUnit)}>
                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                        <div className="sm:col-span-2">
                            <label htmlFor="nomeNovaUnidadeEscolar" className="block mb-2 text-sm font-medium text-[#1C2434] dark:text-white">Nome da Unidade</label>
                            <input 
                              type="text"
                              id="nomeNovaUnidadeEscolar" 
                              className="bg-gray-50 border border-gray-400 text-[#1C2434] text-sm rounded-lg focus:ring-[#247BA0] focus:border-[#247BA0] block w-full p-2.5" 
                              placeholder="Nome da unidade" 
                              {...register("name")}
                              />
                              {errors.name ? <p className="text-[#F87171]">{errors.name.message}</p> : ""}
                        </div>
                    </div>
                    <div className="flex justify-end">
                      <Link to={'/gerenciamento/unidades-escolares'}>
                        <button type="button" className="bg-[#1C2434] hover:opacity-90 mt-5 text-[#F5EDF0] font-bold py-2 px-4 mx-3 rounded"
                        aria-label="Cancelar e voltar à tela anterior">
                          Voltar
                        </button>
                      </Link>
                      <button type="submit" className="bg-[#247BA0] hover:opacity-90 mt-5 text-[#F5EDF0] font-bold py-2 px-4 mx-3 rounded"
                      aria-label="Criar nova unidade escolar">
                        Adicionar
                      </button>
                    </div>
                </form>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
