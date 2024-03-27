import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import { useAuth } from "../context/useAuth";
import { SchoolUnit } from "../interfaces/models/SchoolUnit";
import { useCallback, useEffect, useState } from "react";
import { UnitTypeEnum } from "../interfaces/enums/UnitTypeEnum";
import { ChevronUpDownIcon, ArrowUpTrayIcon, ArrowDownTrayIcon, ArrowUturnLeftIcon, PlusIcon } from "@heroicons/react/24/solid";
import { getSchoolUnitById } from "../services/schoolUnitService";
import { createStockItem, updateStockItem } from "../services/stockItemService";
import axios from "axios";
import * as Yup from "yup"
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Product } from "../interfaces/models/Product";
import { getAllProducts } from "../services/productService";

export type StockItemFormInputs = {
  quantity: number,
  stock?: number,
  product: number
}

const validation = Yup.object().shape({
  product: Yup.number().required('Produto é obrigatório').moreThan(0, 'Selecione um produto'),
  stock: Yup.number(),
  quantity: Yup.number().required('Quantidade é obrigatória').moreThan(0, 'Quantidade deve ser maior do que zero')
});

export default function EditStock() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [schoolUnit, setSchoolUnit] = useState<SchoolUnit | null>(null);
  const [editedQuantity, setEditedQuantity] = useState<{ [key: number]: string }>({});
  const [addStockItem, setAddStockItem] = useState<boolean>(false);
  const [productsList, setProductsList] = useState<Product[] | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<StockItemFormInputs>({ resolver: yupResolver(validation) });

  const handleEditQuantity = (id: number, value: string) => {
    setEditedQuantity({
      ...editedQuantity,
      [id]: value
    });
  };

  const handleSetAddStockItem = async () => {
    setAddStockItem(true);
    const products = await getAllProducts();
    if (products) setProductsList(products);
  }

  const handleAddStockItem = async (form: StockItemFormInputs) => {
    if (schoolUnit?.stock.items.some(i => i.product.id === form.product)) {
      window.alert('Produto já cadastrado.');
    }
    else {
      form.stock = schoolUnit?.stock.id;
      const response = await createStockItem(form);
      if (response === axios.HttpStatusCode.Created) {
        window.alert('Item adicionado com sucesso');
        setAddStockItem(false);
        const updatedSchoolUnit = await getSchoolUnitById(id ? Number.parseInt(id) : 0);
        if (updatedSchoolUnit) setSchoolUnit(updatedSchoolUnit);
      }
      else window.alert(`Ocorreu um erro ao tentar adicionar o item. Código: ${response}`);
    }
  }

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
              {schoolUnit?.main_unit ? (
                <button
                  type="button"
                  className="flex items-center bg-[#1C2434] hover:opacity-90 text-white font-bold mx-2 py-2 px-4 w-42 rounded"
                  onClick={() => handleSetAddStockItem()}>
                  <PlusIcon className="h-6 w-6 mr-3" />
                  Adicionar
                </button>
              ) : ''}  
            </div>

            {/* Formulário para adicionar item de estoque */}
            {addStockItem === true ? (
              <div className="mt-5">
                <h3 className="text-2xl">Informações do novo item do estoque</h3>
                <section className="bg-white rounded-lg border mt-5">
                  <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                      <form onSubmit={handleSubmit(handleAddStockItem)}>
                          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                              <div className="sm:col-span-2">
                                  <label htmlFor="product" className="block mb-2 text-sm font-medium text-[#1C2434] dark:text-white">Produto</label>
                                  <select 
                                    id="product" 
                                    className="bg-gray-50 border border-gray-400 text-[#1C2434] text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                    {...register("product")}
                                    >
                                      <option value={0}>Selecione um produto</option>
                                      {productsList?.map((product) => (
                                        <option 
                                          key={product.id} 
                                          value={product.id}
                                        >
                                          {product.name}
                                        </option>
                                      ))}
                                  </select>
                                  {errors.product ? <p className="text-[#F87171]">{errors.product.message}</p> : ""}
                              </div>
                              <div className="sm:col-span-2">
                                  <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-[#1C2434] dark:text-white">Quantidade do produto</label>
                                  <input 
                                    type="number"
                                    id="quantity" 
                                    className="bg-gray-50 border border-gray-400 text-[#1C2434] text-sm rounded-lg focus:ring-[#247BA0] focus:border-[#247BA0] block w-full p-2.5" 
                                    placeholder="Quantidade do produto" 
                                    {...register("quantity")}
                                    defaultValue={1}
                                    min={1}
                                    />
                                    {errors.quantity ? <p className="text-[#F87171]">{errors.quantity.message}</p> : ""}
                              </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              className="flex items-center bg-[#1C2434] hover:opacity-90 text-white font-bold mt-5 py-2 px-4 mx-3 rounded"
                              onClick={() => setAddStockItem(false)}>
                              Cancelar
                            </button>
                            <button type="submit" className="bg-[#247BA0] hover:opacity-90 mt-5 text-[#F5EDF0] font-bold py-2 px-4 mx-3 rounded">
                                Adicionar
                            </button>
                          </div>
                      </form>
                  </div>
                </section>
              </div>
            ) : ''}

            {/* Listagem itens cadastrados */}
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
                      {user?.isStaff && schoolUnit.main_unit ? (<th scope="col" className="px-6 py-4">Ações</th>) : ''}
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
                        {user?.isStaff && schoolUnit.main_unit ? (                         
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

            <Link to={'/gerenciamento/estoques'} className="inline-block">
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
