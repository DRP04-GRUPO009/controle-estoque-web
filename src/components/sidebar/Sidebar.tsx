import {
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  PowerIcon,
  HomeIcon,
  PencilIcon,
  RectangleStackIcon
} from "@heroicons/react/24/solid";
import { useAuth } from "../../context/useAuth";
import { Link } from "react-router-dom";
 
export default function Sidebar() {
  const { logout } = useAuth()
  
  const handleExit = (): void => {
    logout();
  }

  return (
    <div className="min-h-screen min-w-2/12 bg-[#1C2434] text-[#F1F5F9]">
      <div className="mb-2 p-4 text-center">
        <Typography variant="h5" placeholder={undefined}>
          Controle de Estoque
        </Typography>
      </div>
      <List placeholder={undefined} className="text-[#F1F5F9]">
        <Link to={'/'}>
          <ListItem placeholder={undefined} aria-label="Página inicial">
            <ListItemPrefix placeholder={undefined}>
              <HomeIcon className="h-7 w-7" aria-hidden="true" />
            </ListItemPrefix>
            Início
          </ListItem>
        </Link>
        <Link to={'/perfil'}>
          <ListItem placeholder={undefined} aria-label="Acesso ao seu perfil" >
            <ListItemPrefix placeholder={undefined}>
              <UserCircleIcon className="h-7 w-7" aria-hidden="true" />
            </ListItemPrefix>
            Perfil
          </ListItem>
        </Link>
        <Link to={'/produtos'}>
          <ListItem placeholder={undefined} aria-label="Acesso à tela de produtos" >
            <ListItemPrefix placeholder={undefined}>
              <PencilIcon className="h-7 w-7" aria-hidden="true" />
            </ListItemPrefix>
            Produtos cadastrados
          </ListItem>
        </Link>
          <Link to={'/gerenciamento'}>
            <ListItem placeholder={undefined} aria-label="Área de gerenciamento de unidades escolares e estoques" >
              <ListItemPrefix placeholder={undefined}>
                <RectangleStackIcon className="h-7 w-7" aria-hidden="true" />
              </ListItemPrefix>
              Gerenciamento de Estoque
            </ListItem>
          </Link>
        <ListItem placeholder={undefined} className="" onClick={handleExit} aria-label="Desconectar seu usuário da página" >
          <ListItemPrefix placeholder={undefined}>
            <PowerIcon className="h-7 w-7" aria-hidden="true" />
          </ListItemPrefix>
          Sair
        </ListItem>
      </List>
    </div>
  );
}