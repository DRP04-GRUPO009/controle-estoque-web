import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { useAuth } from "../context/useAuth";
import { Product } from "../interfaces/models/Product";
import { deleteProduct, getAllProducts } from "../services/productService";
import { UnitTypeEnum } from "../interfaces/enums/UnitTypeEnum";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[] | null>(null);

  const fetchProductsList = async () => {
    const productsList = await getAllProducts();
    if (productsList) setProducts(productsList);
  };

  useEffect(() => {
    fetchProductsList();
  }, []);

  const handleDeleteProduct = async (id: number) => {
    const confirmed = window.confirm('Tem certeza que deseja excluir esse produto?');
    if (confirmed) {
      const response = await deleteProduct(id);
      if (response?.status === axios.HttpStatusCode.NoContent) window.alert('Produto excluído com sucesso!'); 
      else window.alert('Ocorreu um erro ao tentar excluir o produto. Tente mais tarde.');
      fetchProductsList();
    }
  }

  return (
    <>
    <div className="flex flex-row">
      <Sidebar />
      <div className="w-10/12 p-5">
        <h2 className="text-3xl">Produtos cadastrados</h2>
        {products ? (
          <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden mt-2">
                {user && (user.permissionGroups.length === 0 || user.isStaff) ? (
                  <Link to={'/produtos/novo'}>
                    <button
                      type="button"
                      className="bg-[#247BA0] hover:opacity-90 text-white font-bold mx-3 w-24 rounded py-2">
                      Novo
                    </button>
                  </Link>
                ) : ''                  
                }
                <table
                  className="min-w-full text-left text-sm font-light bg-white overflow-hidden shadow rounded-lg border mt-5">
                  <thead
                    className="border-b border-[#1C2434] font-medium dark:border-white/10">
                    <tr>
                      <th scope="col" className="px-6 py-4">Código</th>
                      <th scope="col" className="px-6 py-4">Produto</th>
                      <th scope="col" className="px-6 py-4">Descrição</th>
                      <th scope="col" className="px-6 py-4">Unidade de Medida</th>
                      {user && (user.permissionGroups.length === 0 || user.isStaff) ? (<th scope="col" className="px-6 py-4">Ações</th>) : ''}
                    </tr>
                  </thead>
                  <tbody>                
                    {products.map((product) => (
                      <tr className="flex-shrink align-center" key={product.id}>
                        <td className="px-6 py-4 font-medium">{product.id}</td>
                        <td className="px-6 py-4">{product.name}</td>
                        <td className="px-6 py-4">{product.description}</td>
                        <td className="px-6 py-4">{UnitTypeEnum[product.unit_type]}</td>
                        <td>
                          <div className="flex">
                            {user && (user.permissionGroups.length === 0 || user.isStaff) ? (
                              <>
                                <Link to={`${product.id}`}>
                                  <button
                                    type="button"
                                    className="bg-[#1C2434] hover:opacity-90 text-white font-bold py-2 px-4 mx-3 w-24 rounded">
                                    Editar
                                  </button>
                                </Link>
                                <button
                                  type="button"
                                  className="bg-[#F87171] hover:opacity-90 text-white font-bold py-2 px-4 mx-3 w-24 rounded" 
                                  onClick={() => handleDeleteProduct(product.id)}>
                                  Excluir
                                </button>
                              </>
                            ) : (
                              ''
                            )                            
                            }
                          </div>
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
          <p>Não há produtos cadastrados.</p>
        )}
      </div>
    </div>
    </>
  );
}