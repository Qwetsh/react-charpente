import Classes from "./WorkSiteInProgress.module.css";
import WorkSite from "../Components/WorkSite";
import WorksiteForm from "../Components/WorksiteForm";
import NewWorkSiteBtn from "../Components/newWorkSiteBtn";
import { useState, useEffect } from "react";

function WorkSiteInProgress(props) {
  const [NewWorkSiteBtnisClicked, setIsClicked] = useState(false);

  return (
    <>

        <div className={Classes.bigContainer}>
          <WorkSite changeState={NewWorkSiteBtnisClicked} />
          {NewWorkSiteBtnisClicked && (
            <WorksiteForm
              onClick={() => {
                setIsClicked(!NewWorkSiteBtnisClicked);
              }}
            />
          )}
        </div>

        {!NewWorkSiteBtnisClicked && (
        <NewWorkSiteBtn
          onClick={() => {
            setIsClicked(!NewWorkSiteBtnisClicked);
          }}
        />
      )}
    </>
  );
}

export default WorkSiteInProgress;
