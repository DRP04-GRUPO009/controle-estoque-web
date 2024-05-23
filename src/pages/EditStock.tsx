/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useParams } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import { useAuth } from "../context/useAuth";
import { SchoolUnit } from "../interfaces/models/SchoolUnit";
import { useEffect, useState } from "react";
import { UnitTypeEnum } from "../interfaces/enums/UnitTypeEnum";
import { ChevronUpDownIcon, ArrowUpTrayIcon, ArrowUturnLeftIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { getAllSchoolsUnits, getSchoolUnitById, paginateStockItems } from "../services/schoolUnitService";
import { createProductTransfer, createStockItem, deleteStockItem, updateStockItem } from "../services/stockItemService";
import axios from "axios";
import * as Yup from "yup"
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getAllProducts } from "../services/productService";
import { Product } from "../interfaces/models/Product";
import { StockItem } from "../interfaces/models/StockItem";

export type StockItemFormInputs = {
  quantity: number,
  stock?: number,
  product: number
}

export type TransferProductFormInputs = {
  quantity: number,
  product: number,
  origin_school_unit?: number,
  target_school_unit: number,
}

const stockItemValidation = Yup.object().shape({
  product: Yup.number().required('Produto é obrigatório').moreThan(0, 'Selecione um produto'),
  quantity: Yup.number().required('Quantidade é obrigatória').moreThan(0, 'Quantidade deve ser maior do que zero'),
  stock: Yup.number(),
});

const transferProductValidation = Yup.object().shape({
  product: Yup.number().required('Produto é obrigatório').moreThan(0, 'Selecione um produto'),
  quantity: Yup.number().required('Quantidade é obrigatória').moreThan(0, 'Quantidade deve ser maior do que zero'),
  origin_school_unit: Yup.number(),
  target_school_unit: Yup.number().required('Unidade de destino é obrigatória').moreThan(0, 'Selecione uma unidade de destino')
});

export default function EditStock() {
  const PAGE_SIZE = 10;
  const ORDER_BY_NAME_ASC = 'name';

  const { id } = useParams();
  const { user } = useAuth();

  const [schoolUnit, setSchoolUnit] = useState<SchoolUnit | null>(null);
  const [editedQuantity, setEditedQuantity] = useState<{ [key: number]: string }>({});
  const [addStockItem, setAddStockItem] = useState<boolean>(false);
  const [transferProduct, setTransferProduct] = useState<boolean>(false);

  const [stockItemsByPage, setStockItemsByPage] = useState<StockItem[][]>([]);
  const [page, setPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [productsList, setProductsList] = useState<Product[] | null>(null);
  const [schoolsUnitsList, setSchoolsUnitsList] = useState<SchoolUnit[] | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<StockItemFormInputs>({ resolver: yupResolver(stockItemValidation) });
  const { register: register2, handleSubmit: handleSubmit2, formState: { errors: errors2 } } = useForm<TransferProductFormInputs>({ resolver: yupResolver(transferProductValidation) });

  const handleUpdatePageNumber = (page: number) => {
    if (page <= 0) page = 1;
    else if (page > numberOfPages) page = numberOfPages;
    setPage(page);
  }

  const handleEditQuantity = (id: number, value: string) => {
    setEditedQuantity({
      ...editedQuantity,
      [id]: value
    });
  };

  const handleSetAddStockItem = async () => {
    setTransferProduct(false);
    setAddStockItem(true);
    const products = await getAllProducts(ORDER_BY_NAME_ASC);
    if (products) setProductsList(products);
  };

  const handleSetTransferProduct = async () => {
    setAddStockItem(false);
    setTransferProduct(true);
    const schoolsUnits = await getAllSchoolsUnits();
    if (schoolsUnits) {
      schoolsUnits.sort((a, b) => a.name.localeCompare(b.name));
      setSchoolsUnitsList(schoolsUnits);
    }
  };

  const handleAddStockItem = async (form: StockItemFormInputs) => {
    if (schoolUnit?.stock.items.some(i => i.product.id === form.product)) {
      window.alert('Produto já cadastrado.');
    }
    else {
      form.stock = schoolUnit?.stock.id;
      const response = await createStockItem(form);
      if (response === axios.HttpStatusCode.Created) {
        window.alert('Item adicionado com sucesso');
        const updatedSchoolUnit = await getSchoolUnitById(id ? Number.parseInt(id) : 0);
        if (updatedSchoolUnit) setSchoolUnit(updatedSchoolUnit);
        setAddStockItem(false);
      }
      else window.alert(`Ocorreu um erro ao tentar adicionar o item. Código: ${response}`);
    }
  };

  const handleTransferProduct = async (form: TransferProductFormInputs) => {
    const originStockItem = schoolUnit?.stock.items.find(s => s.product.id === form.product)
    if (originStockItem && form.quantity > originStockItem.quantity) window.alert('Quantidade para tranferência maior do que a quantidade disponível no estoque')
    else {
      form.origin_school_unit = schoolUnit?.stock.school_unit;
      const response = await createProductTransfer(form);
      if (response) {
        if (response === axios.HttpStatusCode.Created) {
          window.alert('Transferência efetuada com sucesso');
          const updatedSchoolUnit = await getSchoolUnitById(id ? Number.parseInt(id) : 0);
          if (updatedSchoolUnit) setSchoolUnit(updatedSchoolUnit);
          setTransferProduct(false);
        }
        else window.alert(`Ocorreu um erro ao tentar efetuar a transferência. Código: ${response}`);
      }
    }
  };

  const handleUpdateStockItemQuantity = async (id: number) => {
    const quantity = editedQuantity[id];
    const stockItem = schoolUnit?.stock.items.find(i => i.id === id);

    if (stockItem) {
      if ((Number.parseInt(quantity) > stockItem.quantity) && schoolUnit?.main_unit === false) {
        window.alert('Não é possível aumentar a quantidade do item no estoque')
      }
      else {
        const item: StockItemFormInputs = {
          product: stockItem.product.id,
          quantity: Number.parseInt(quantity),
          stock: stockItem.stock
        }
  
        const response = await updateStockItem(stockItem.id, item);
        if (response === axios.HttpStatusCode.Ok) window.alert("Quantidade do item alterada com sucesso");
        else window.alert(`Ocorreu um erro ao tentar alterar a quantidade do item. Código: ${response}`);
      }
    }
  };

  const handleDeleteStockItem = async (id: number) => {
    const confirmed = window.confirm('Tem certeza que deseja excluir esse item do estoque?');
    if (confirmed) {
      const response = await deleteStockItem(id);
      if (response === axios.HttpStatusCode.NoContent) window.alert("Item excluído com sucesso.");
      else window.alert(`Não foi possível excluir o item. Código: ${response}`);
      fetchSchoolUnitById();
    }
  };

  useEffect(() => {
    fetchSchoolUnitById();
  }, [id]);

  const fetchSchoolUnitById = async () => {
    const schoolUnit = await getSchoolUnitById(id ? Number.parseInt(id) : 0);
    if (schoolUnit) {
      schoolUnit.stock.items.sort((a, b) => a.product.name.localeCompare(b.product.name));
      setSchoolUnit(schoolUnit);
      setStockItemsByPage(paginateStockItems(schoolUnit.stock.items, PAGE_SIZE));
      setNumberOfPages(Math.ceil(schoolUnit.stock.items.length / PAGE_SIZE));
    }
  };

  return (
    <>
     <div className="flex flex-row">
        <Sidebar />
        {schoolUnit ? (
          <div className="w-10/12 p-5">
            <h2 className="text-3xl">Estoque: {schoolUnit.name}</h2>
            {schoolUnit?.main_unit && user && (user.permissionGroups.length === 0 || user.isStaff) ? (
              <div className="flex mt-5">
                  <button
                    type="button"
                    className="flex items-center bg-[#1C2434] hover:opacity-90 text-white font-bold mx-2 py-2 px-4 w-42 rounded"
                    onClick={() => handleSetTransferProduct()}
                    aria-label="Acessar formulário de transferência de produtos">
                    <ArrowUpTrayIcon className="h-6 w-6 mr-3" aria-hidden="true" />
                    Enviar Produtos
                  </button>   
                  <button
                    type="button"
                    className="flex items-center bg-[#1C2434] hover:opacity-90 text-white font-bold mx-2 py-2 px-4 w-42 rounded"
                    onClick={() => handleSetAddStockItem()}
                    aria-label="Cadastrar novo item no estoque">
                    <PlusIcon className="h-6 w-6 mr-3" aria-hidden="true" />
                    Adicionar
                  </button>
              </div>
            ) : ''}  

            {/* Formulário para adicionar item de estoque */}
            {addStockItem === true ? (
              <div className="mt-5">
                <h3 className="text-2xl">Informações do novo item do estoque</h3>
                <section className="bg-white rounded-lg border mt-5">
                  <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                      <form onSubmit={handleSubmit(handleAddStockItem)}>
                          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                              <div className="sm:col-span-2">
                                  <label htmlFor="produto" className="block mb-2 text-sm font-medium text-[#1C2434] dark:text-white">Produto</label>
                                  <select 
                                    id="produto" 
                                    className="bg-gray-50 border border-gray-400 text-[#1C2434] text-sm rounded-lg focus:ring-[#247BA0] focus:border-[#247BA0] block w-full p-2.5"
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
                                  <label htmlFor="quantidadeDoProduto" className="block mb-2 text-sm font-medium text-[#1C2434] dark:text-white">Quantidade do produto</label>
                                  <input 
                                    type="number"
                                    id="quantidadeDoProduto" 
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
                              onClick={() => setAddStockItem(false)}
                              aria-label="Cancelar e retornar à tela anterior">
                              Cancelar
                            </button>
                            <button type="submit" className="bg-[#247BA0] hover:opacity-90 mt-5 text-[#F5EDF0] font-bold py-2 px-4 mx-3 rounded"
                            aria-label="Adicionar produto ao estoque">
                                Adicionar
                            </button>
                          </div>
                      </form>
                  </div>
                </section>
              </div>
            ) : ''}

            {/* Transferência de produtos */}
            {transferProduct ? (
              <div className="mt-5">
                <h3 className="text-2xl">Preencha as informações para transferência</h3>
                <section className="bg-white rounded-lg border mt-5">
                  <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                    <form onSubmit={handleSubmit2(handleTransferProduct)}>
                          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                              <div className="sm:col-span-2">
                                <label htmlFor="unidadeEscolar" className="block mb-2 text-sm font-medium text-[#1C2434] dark:text-white">Unidade Escolar</label>
                                <select 
                                  id="unidadeEscolar"
                                  className="bg-gray-50 border border-gray-400 text-[#1C2434] text-sm rounded-lg focus:ring-[#247BA0] focus:border-[#247BA0] block w-full p-2.5"
                                  {...register2("target_school_unit")}>
                                  <option value={0}>Selecione uma Unidade</option>
                                  {schoolsUnitsList?.map((targetSchoolUnit) => (
                                    targetSchoolUnit.stock.school_unit != schoolUnit.stock.school_unit && (
                                      <option 
                                        key={targetSchoolUnit.stock.school_unit} 
                                        value={targetSchoolUnit.stock.school_unit}
                                      >
                                        {targetSchoolUnit.name}
                                      </option> 
                                    )
                                  ))}
                                </select>
                                {errors2.target_school_unit ? <p className="text-[#F87171]">{errors2.target_school_unit.message}</p> : ""}
                              </div>
                              <div className="sm:col-span-2">
                                <label htmlFor="produto" className="block mb-2 text-sm font-medium text-[#1C2434] dark:text-white">Produto</label>
                                <select
                                  id="produto" 
                                  className="bg-gray-50 border border-gray-400 text-[#1C2434] text-sm rounded-lg focus:ring-[#247BA0] focus:border-[#247BA0] block w-full p-2.5"
                                  {...register2("product")}>
                                  {schoolUnit?.stock.items.map((item) => (
                                    <option key={item.id} value={item.product.id}>{item.product.name}</option>
                                  ))}
                                </select>
                                {errors2.product ? <p className="text-[#F87171]">{errors2.product.message}</p> : ""}
                              </div>
                              <div className="sm:col-span-2">
                                <label htmlFor="quantidade" className="block mb-2 text-sm font-medium text-[#1C2434] dark:text-white">Quantidade</label>
                                <input 
                                  id="quantidade"
                                  type="number"
                                  className="bg-gray-50 border border-gray-400 text-[#1C2434] text-sm rounded-lg focus:ring-[#247BA0] focus:border-[#247BA0] block w-full p-2.5" 
                                  {...register2("quantity")}
                                />
                                {errors2.quantity ? <p className="text-[#F87171]">{errors2.quantity.message}</p> : ""}
                              </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              className="flex items-center bg-[#1C2434] hover:opacity-90 text-white font-bold mt-5 py-2 px-4 mx-3 rounded"
                              onClick={() => setTransferProduct(false)}
                              aria-label="Cancelar e voltar à tela anterior">
                              Cancelar
                            </button>
                            <button type="submit" className="bg-[#247BA0] hover:opacity-90 mt-5 text-[#F5EDF0] font-bold py-2 px-4 mx-3 rounded"
                            aria-label="Realizar a transferência do produto">
                              Transferir
                            </button>
                          </div>
                        </form>
                  </div>
                </section>
              </div>
            ) : ''}

            {/* Listagem itens cadastrados */}
            {transferProduct ? '' : (
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
                        <th scope="col" className="px-6 py-4">Ações</th>
                      </tr>
                    </thead>
                    <tbody>                
                      {stockItemsByPage[page - 1].map((item) => (
                        <tr className="" key={item.id}>
                          <td className="px-6 py-2">{item.id}</td>
                          <td className="px-6 py-2">{item.product.name}</td>
                          <td className="px-6 py-2">{UnitTypeEnum[item.product.unit_type.valueOf()]}</td>
                            <td>
                              <input 
                              type="number"
                              id={`item-${item.id}-quantity`}
                              min={0}
                              max={user && user.permissionGroups.length > 0 ? item.quantity : Number.MAX_SAFE_INTEGER}
                              defaultValue={item.quantity}
                              onChange={(e) => handleEditQuantity(item.id, e.target.value)}
                              aria-label={`Quantidade do produto ${item.product.name}`}
                              />
                            </td>                     
                            <td className="flex px-6 py-2">
                              <button
                                type="button"
                                className="flex items-center bg-[#247BA0] hover:opacity-90 text-white font-bold mx-2 py-2 px-4 w-42 rounded disabled:cursor-not-allowed"
                                onClick={() => handleUpdateStockItemQuantity(item.id)}
                                aria-label={`Atualizar quantidade do produto ${item.product.name}`}
                                >
                                <ChevronUpDownIcon className="mr-2 h-5 w-5" />
                                Atualizar Quantidade
                              </button> 
                              <button
                                  type="button"
                                  className="flex items-center bg-[#F87171] hover:opacity-90 text-white font-bold mx-2 py-2 px-4 w-42 rounded disabled:cursor-not-allowed" 
                                  onClick={() => handleDeleteStockItem(item.id)}
                                  aria-label={`Excluir o produto ${item.product.name}`}>
                                  <TrashIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                                  Excluir
                                </button>                      
                            </td>                    
                        </tr>
                      ))}
                    </tbody>
                </table>
                <div className="flex justify-center mt-3">
                  <nav aria-label="Navegação páginas de produtos">
                    <ul className="inline-flex space-x-2">
                      <li><button className="flex items-center justify-center w-10 h-10 text-[#247BA0] transition-colors duration-250 rounded-full focus:shadow-outline hover:bg-[#247BA0be] hover:text-white" onClick={() => handleUpdatePageNumber(page - 1)} aria-label={`Ir para a página anterior`}>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path></svg></button>
                      </li>
                      {Array.apply(0, Array(numberOfPages + 1)).map(function (_x, i) {
                        if (i === page)
                          return <li><button className="w-10 h-10 text-white transition-colors duration-150 bg-[#247BA0] border border-r-0 border-[#247BA0] rounded-full focus:shadow-outline">{i}</button></li>;
                        else if (i !== page && i != 0)
                          return <li><button className="w-10 h-10 text-[#247BA0] transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-[#247ba0be] hover:text-white" onClick={() => handleUpdatePageNumber(i)} aria-label={`Ir para a página ${i}`}>{i}</button></li>
                      })}

                      <li><button className="flex items-center justify-center w-10 h-10 text-[#247BA0] transition-colors duration-250 bg-white rounded-full focus:shadow-outline hover:bg-[#247ba0be] hover:text-white" onClick={() => handleUpdatePageNumber(page + 1)} aria-label={`Ir para a próxima página`}>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path></svg></button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            )}

            {!transferProduct && (
              <Link to={'/gerenciamento/estoques'} className="inline-block">
                <button
                  type="button"
                  className="flex items-center bg-[#1C2434] hover:opacity-90 text-white font-bold mt-5 py-2 px-4 mx-3 w-32 rounded"
                  aria-label="Cancelar e voltar para a página anterior">
                  <ArrowUturnLeftIcon className="h-6 w-6 mr-3" aria-hidden="true" />
                  Voltar
                </button>
              </Link> 
            )}
          </div>
        ) : (
          ''
        )}
      </div>
    </>
  );
}
