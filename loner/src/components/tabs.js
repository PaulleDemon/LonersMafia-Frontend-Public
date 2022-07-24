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

const Tabs = ({tabs}) => {

    const [currentTab, setCurrentTab] = useState(tabs[0].tabValue)
    const tabs = useMemo(() => tabs, [tabs])



    return (

        <div className="tabs-container">
            
            <div className="tabs-header">
                {
                    tabs.map((tabs) => {
                        
                        return (
                            <li key={tabs.tabValue} 
                                className={`tab ${tabs.tabValue === currentTab? "active-tab" : ""}`}
                                onClick={()=>setCurrentTab(tabs.tabValue)}
                                >
                                
                                {tabs.tabName}
                            </li>
                        )
                    
                    })
                }
            </div>
            
            <div className="tab-content">
                {tabs[tabs.findIndex(tab => tab.tabValue === currentTab)].tabComponent}
            </div>

        </div>

    )

}

export default Tabs