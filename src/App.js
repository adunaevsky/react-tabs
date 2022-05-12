
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DataProvider from './services/DataProvider';
import cFun from './services/cFun';
import { useLayoutEffect, useState, useMemo, useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { createBrowserHistory } from "history";
console.log(createBrowserHistory)

function App() {

  const [tabs, setTabs] = useState(undefined);
  const [text, setText] = useState(undefined);
  const [selectedTab, setSelectedTab] = useState('');
  const [dataReady, setDataReady] = useState(false);
  const queryParams = new URLSearchParams(window.location.search);
  let defaultTab = '';

  useLayoutEffect(() => {

    DataProvider('master', 'dictionary', 'root', setDictionary);
  }, []);

  function setDictionary(d) {
    var allText = cFun.createDictionary('textID', 'EN', d);
    setText(allText);
  }

  useLayoutEffect(() => {
    if (text) {
      DataProvider('master', 'tabs', 'root', setTabSpecs);
    }
  }, [text]);

  useEffect(() => {

    if (selectedTab.length > 0 && !dataReady) {
      setDataReady(true);
    }
  }, [selectedTab]);

  function setDefaultTab() {
    defaultTab = queryParams.get('tab');

  }

  function setTabSpecs(d) {


    d.forEach((t) => {
      t.text = text[t.labelID];
    });
    setTabs(d);
    setDefaultTab();

    if (defaultTab) {

      setSelectedTab(defaultTab);
    } else {
      setSelectedTab(d[0].id)
    }


  }

  function updateTabSelection(t) {

    queryParams.set('map', t);

    console.log(queryParams)
    setSelectedTab(t);
  }





  return (
    <div className="App">
      {selectedTab}

      {dataReady &&
        <Tabs onSelect={updateTabSelection}
          defaultActiveKey={selectedTab} id="uncontrolled-tab-example"
          className="mb-3">

          {tabs.map((t, i) => {
            return (<Tab eventKey={t.id} title={t.text} key={t.id}>{t.text}</Tab>);
          })
          }
        </Tabs>}



    </div>
  );
}

/*  {getText && getText.map((t) => {
        return <div key={t.textID}>{t.textID}</div>;
      })
      } */

export default App;
