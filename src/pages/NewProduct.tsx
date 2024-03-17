import Sidebar from "../components/sidebar/Sidebar";
import * as Yup from "yup"
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UnitTypeEnum } from "../interfaces/enums/UnitTypeEnum";
import { createProduct } from "../services/productService";
import { Link, useNavigate } from "react-router-dom";

export type ProductFormInputs = {
  name: string,
  description: string,
  unit_type: number
}

const validation = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  description: Yup.string().required('Descrição é obrigatória'),
  unit_type: Yup.number().required('Unidade de medida é obrigatória').moreThan(0, 'Unidade de medida é obrigatória')
});

export default function NewProduct() {
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormInputs>({ resolver: yupResolver(validation) });
  const enumKeys: (keyof typeof UnitTypeEnum)[] = Object.keys(UnitTypeEnum).slice(-6) as (keyof typeof UnitTypeEnum)[];
  const navigate = useNavigate();

  const handleCreateProduct = async (form: ProductFormInputs): Promise<void> => {
    const response = await createProduct(form);
    if (response) {
      window.alert('Produto cadastrado com sucesso!');
    }
    else {
      window.alert('Ocorreu um erro, tente mais tarde.')
    }
    navigate('/produtos');
  };  

  return (
    <>
      <div className="flex flex-row">
        <Sidebar />
        <div className="w-10/12 p-5">
          <section className="bg-white">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Adicionar um novo produto</h2>
            <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                <form onSubmit={handleSubmit(handleCreateProduct)}>
                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                        <div className="sm:col-span-2">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome do produto</label>
                            <input 
                              type="text"
                              id="name" 
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                              placeholder="Nome do produto" 
                              {...register("name")}
                              />
                              {errors.name ? <p className="text-[#F87171]">{errors.name.message}</p> : ""}
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Unidade de medida</label>
                            <select 
                              id="category" 
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                              {...register("unit_type")}>
                                <option value={0}>Selecione uma unidade</option>
                                {enumKeys.map((key: keyof typeof UnitTypeEnum) => (
                                  <option key={UnitTypeEnum[key]} value={UnitTypeEnum[key]}>
                                    {key}
                                  </option>
                                ))}
                            </select>
                            {errors.unit_type ? <p className="text-[#F87171]">{errors.unit_type.message}</p> : ""}
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descrição</label>
                            <textarea 
                              id="description" 
                              rows={4} 
                              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500" 
                              placeholder="Descrição do produto"
                              {...register("description")}
                            ></textarea>
                            {errors.description ? <p className="text-[#F87171]">{errors.description.message}</p> : ""}
                        </div>
                    </div>
                    <div className="flex justify-end">
                      <Link to={'/produtos'}>
                        <button type="button" className="bg-[#1C2434] hover:opacity-90 mt-5 text-white font-bold py-2 px-4 mx-3 rounded">
                            Voltar
                        </button>
                      </Link>
                      <button type="submit" className="bg-[#3C50E0] hover:opacity-90 mt-5 text-white font-bold py-2 px-4 mx-3 rounded">
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