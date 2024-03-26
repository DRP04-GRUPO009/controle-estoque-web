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
  const { logout, user } = useAuth()
  
  const handleExit = (): void => {
    logout();
  }

  return (
    <div className="h-[100vh] w-2/12 bg-[#1C2434] text-[#F1F5F9]">
      <div className="mb-2 p-4 text-center">
        <Typography variant="h5" placeholder={undefined}>
          Controle de Estoque
        </Typography>
      </div>
      <List placeholder={undefined} className="text-[#F1F5F9]">
        <Link to={'/'}>
          <ListItem  placeholder={undefined}>
            <ListItemPrefix placeholder={undefined}>
              <HomeIcon className="h-7 w-7" />
            </ListItemPrefix>
            Início
          </ListItem>
        </Link>
        <Link to={'/perfil'}>
          <ListItem placeholder={undefined}>
            <ListItemPrefix placeholder={undefined}>
              <UserCircleIcon className="h-7 w-7" />
            </ListItemPrefix>
            Perfil
          </ListItem>
        </Link>
        <Link to={'/produtos'}>
          <ListItem placeholder={undefined}>
            <ListItemPrefix placeholder={undefined}>
              <PencilIcon className="h-7 w-7" />
            </ListItemPrefix>
            Produtos cadastrados
          </ListItem>
        </Link>
          <Link to={'/gerenciamento'}>
            <ListItem placeholder={undefined}>
              <ListItemPrefix placeholder={undefined}>
                <RectangleStackIcon className="h-7 w-7" />
              </ListItemPrefix>
              Gerenciamento de Estoque
            </ListItem>
          </Link>
        <ListItem placeholder={undefined} className="" onClick={handleExit}>
          <ListItemPrefix placeholder={undefined}>
            <PowerIcon className="h-7 w-7" />
          </ListItemPrefix>
          Sair
        </ListItem>
      </List>
    </div>
  );
}