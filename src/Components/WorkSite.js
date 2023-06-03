import React, { Fragment, useState, useEffect } from "react";
import NewCoupe from "./NewCoupe";
import classes from "./WorkSite.module.css";

export default function WorkSite(props) {
  const [newCoupeIsClicked, setNewCoupeIsClicked] = useState(false);
  const [CoupeIsClicked, setCoupeIsClicked] = useState(false);

  const [chantiers, setChantiers] = useState([]);

  let stateOfNewWorkSiteBtnisClicked = props.changeState;

  useEffect(() => {
    const fetchChantier = async () => {
      try {
        const response = await fetch(
          "https://carpenter-b30a8-default-rtdb.europe-west1.firebasedatabase.app/chantiers.json"
        );
        if (!response.ok) {
          throw new Error("Une erreur s'est produite !");
        }
        const responseData = await response.json();
        console.log(responseData);
        const loadedChantier = [];
        for (const key in responseData) {
          loadedChantier.push({
            id: key,
            name: responseData[key].Infochantier.name,
            location: responseData[key].Infochantier.location,
            date: responseData[key].Infochantier.date,
            commentary: responseData[key].Infochantier.commentary,
            newCoupeIsClicked: false,
            coupes: [],
          });
          for (const key2 in responseData[key].coupe) {
            loadedChantier[loadedChantier.length - 1].coupes.push({
              longueur: responseData[key].coupe[key2].coupe.longueur,
              circonference: responseData[key].coupe[key2].coupe.circonference,
              indiceTarif: responseData[key].coupe[key2].coupe.indiceTarif,
              volumeCoupe: (
                ((responseData[key].coupe[key2].coupe.longueur / 100) *
                  Math.pow(
                    responseData[key].coupe[key2].coupe.circonference / 100,
                    2
                  )) /
                (4 * Math.PI)
              ).toFixed(2),
            });
          }
        }
        setChantiers(loadedChantier);

        console.log(loadedChantier);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchChantier();
  }, [stateOfNewWorkSiteBtnisClicked]);

  const array1 = [1, 2, 3, 4];

  const initialValue = 0;
  const sumWithInitial = array1.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    initialValue
  );

  const handleDeleteChantier = async (id) => {
    try {
      const response = await fetch(
        `https://carpenter-b30a8-default-rtdb.europe-west1.firebasedatabase.app/chantiers/${id}.json`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Une erreur s'est produite !");
      }
      const updatedChantiers = chantiers.filter(
        (chantier) => chantier.id !== id
      );
      setChantiers(updatedChantiers);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleOpenNewCoupe = (id) => {
    //select the right chantier in the array and put the newCoupeIsClicked to true for showing the new coupe component to the right chantier

    const updatedChantiers = chantiers.map((chantier) => {
      //next line is the key
      if (chantier.id === id) chantier.newCoupeIsClicked = true; //next line is the key
      return chantier; //next line is the key
    });
    setChantiers(updatedChantiers);
  };

  const chantiersAMontrer = chantiers.map((chantier) => (
    <React.Fragment key={chantier.id}>
      <div className={classes.chantierContainer}>
        <button
          className={classes.deleteBtn}
          onClick={() => handleDeleteChantier(chantier.id)}
        >
          X
        </button>
        <h1 className={classes.clientName}>{chantier.name}</h1>

        <div className={classes.mainInformations}>
          <p>{chantier.location}</p>
          <p>{chantier.date}</p>
        </div>
        <hr />
        <p className={classes.commentary}>{chantier.commentary}</p>

        <div className={classes.lesCalculs}>
          <div>
            Volume Total{" "}
            {chantier.coupes.reduce(
              (acc, coupe) => parseFloat(coupe.volumeCoupe) + acc,
              0
            )}
            <span> m</span>
            <sup>3</sup>
          </div>
          <div>Prix total</div>
        </div>
        <hr />
        <div className={classes.allcoupe}>
          {chantier.coupes.map((coupe) => (
            <div className={classes.coupes} >
              <div onClick={() =>setCoupeIsClicked(!CoupeIsClicked)}> {`Coupe n° ${chantier.coupes.indexOf(coupe) + 1}`} </div>
              <hr className={classes.separation} />
              <div className={CoupeIsClicked ? classes.informationsHide:classes.informations}>
                <div className={classes.coupe}>
                  <span>Longueur </span>
                  <span>{`${coupe.longueur} cm`}</span>
                </div>
                <div className={classes.coupe}>
                  <span>Circonférence </span>
                  <span>{`${coupe.circonference} cm`}</span>
                </div>
                <div className={classes.coupe}>
                  <span>Indice tarif </span>
                  <span>{coupe.indiceTarif}</span>
                </div>
                <div className={classes.coupe}>
                  <span>V coupe</span>
                  <span>
                    {` ${coupe.volumeCoupe} m`}
                    <sup>3</sup>
                  </span>
                </div>
                <div className={classes.coupe}>
                  <span>coût coupe </span>
                  <span>29€</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {chantier.newCoupeIsClicked && (
          <NewCoupe
            id={chantier.id}
            onClick={() => {
              //close the new coupe component
              const updatedChantiers = chantiers.map((chantier) => {
                if (chantier.id === chantier.id)
                  chantier.newCoupeIsClicked = false;
                return chantier;
              }); //close the new coupe component
              setChantiers(updatedChantiers);
            }}
          />
        )}
        {!chantier.newCoupeIsClicked && (
          <button
            className={classes.newCoupe}
            onClick={() => handleOpenNewCoupe(chantier.id)}
          >
            Nouvelle coupe
          </button>
        )}
      </div>
    </React.Fragment>
  ));

  return (
    <>
      <div>{chantiersAMontrer}</div>
    </>
  );
}
