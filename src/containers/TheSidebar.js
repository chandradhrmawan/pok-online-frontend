import React, { useContext, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from '@coreui/react'

import LogoMini from '../assets/logo_square.png'
import LogoWide from '../assets/logo_medium.png'

import SecurityContext from 'src/SecurityContext'

const TheSidebar = () => {
  const { get } = useContext(SecurityContext)
  const [menuList, setMenuList] = useState([]);
  const dispatch = useDispatch()
  const show = useSelector(state => state.sidebarShow)
  const [minimized, setMinimized] = useState(true);

  useEffect(() => {
    get("/api/user/menu")
      .then(r => {
        const mapped = r.data.map(m => ({
          _tag: m.subMenus.length > 0 ? 'CSidebarNavDropdown' : 'CSidebarNavItem',
          name: m.preferredName,
          to: m.pageLink,
          icon: m.icon,
          _children: m.subMenus.length > 0 ? m.subMenus.map(sm => ({
            _tag: 'CSidebarNavItem',
            name: sm.preferredName,
            to: sm.pageLink,
            icon: sm.icon,
          })) : undefined
        }));
        setMenuList(mapped);
      })
  }, [get]);

  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({type: 'set', sidebarShow: val })}
      onMinimizeChange={setMinimized}
    >
      <CSidebarBrand className="d-md-down-none" style={{backgroundColor: "#fefefe"}} to="/">
        <img src={minimized ? LogoWide : LogoMini} alt="Logo PU" style={{height: 42}}/>
      </CSidebarBrand>
      <CSidebarNav>

        <CCreateElement
          items={menuList}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none"/>
    </CSidebar>
  )
}

export default React.memo(TheSidebar)
