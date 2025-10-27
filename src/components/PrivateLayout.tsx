import { Outlet } from "react-router-dom";



export default function PrivateLayout() {
  return (
    <div>
        <Outlet/>
    </div>
  )
}
