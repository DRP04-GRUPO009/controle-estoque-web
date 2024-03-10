import { useAuth } from "../context/useAuth";
import Sidebar from "../components/sidebar/Sidebar";

export default function Profile() {
    const { user } = useAuth();
    return (
        <>
            <div className="flex flex-row">
                <Sidebar />
                <div className="w-10/12 p-5">
                    <h2 className="text-3xl">Suas informações</h2>
                    <div className="bg-white overflow-hidden shadow rounded-lg border mt-5">
                      <div className="px-4 py-5 sm:px-6">
                          <p className="mt-1 max-w-2xl text-sm ">
                              Para alterar suas informações, entre em contato com o administrador.
                          </p>
                      </div>
                      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                          <dl className="sm:divide-y sm:divide-gray-200">
                              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                  <dt className="text-sm font-medium ">
                                      Nome completo
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                      { user?.firstName } { user?.lastName }
                                  </dd>
                              </div>
                              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                  <dt className="text-sm font-medium ">
                                      Nome de usuário
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                      { user?.username }
                                  </dd>
                              </div>
                              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                  <dt className="text-sm font-medium ">
                                      Pode gerenciar informações do estoque?
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                      { user?.isStaff ? 'Sim' : 'Não' }
                                  </dd>
                              </div>
                          </dl>
                      </div>
                  </div>
                </div>
            </div>
        </>
    );
}
