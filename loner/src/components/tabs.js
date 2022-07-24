import { useMemo, useState } from "react"


/**
 * provides a tabs like component to switch between tabs
 * 
 * @params tabs - [{
 *                  tabName: str    
 *                  tabComponent: component    
 *                  tabValue: str    
 *              }]
 */

const Tabs = ({tabs, className=""}) => {

    console.log("Tabs: ", tabs)

    const [currentTab, setCurrentTab] = useState(tabs[0].tabValue)
   
    const navTabs = useMemo(() => tabs, [tabs])

    // console.log("COMponent: ", navTabs[navTabs.findIndex(tab => tab.tabValue === currentTab)])
    return (

        <div className={`tabs-container ${className}`}>
            
            <div className="tabs-header">
                {
                    navTabs.map((tab) => {
                        
                        return (
                            <li key={tab.tabValue} 
                                className={`tab ${tab.tabValue === currentTab? "active-tab" : ""}`}
                                onClick={()=>setCurrentTab(tab.tabValue)}
                                >
                                
                                {tab.tabName}
                            </li>
                        )
                    
                    })
                }
            </div>
            
            <div className={`tab-content`}>
                {navTabs[navTabs.findIndex(tab => tab.tabValue === currentTab)].tabComponent}
            </div>

        </div>

    )

}

export default Tabs