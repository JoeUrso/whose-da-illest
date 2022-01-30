import axios from "axios";
import React, { Component } from "react";
import GradeRapper from "../../components/GradeRapper/GradeRapper";
import RapperInfo from "../../components/RapperInfo/RapperInfo";
import Results from "../../components/Results/Results";
import "./BattlePage.scss";
const API_URL = process.env.API_URL || "http://localhost:8000";
const SPOTIFY_URL = "https://api.spotify.com/v1/search?";

export default class BattlePage extends Component {
    state = {
        battle: [],
        rapper1: [],
        rapper2: [],
        isRapperInfoLoading: true,
        isInfo: true,
        isRapper1: false,
        isRapper2: false,
        isResults: false,
        criteria: [
            { id: 1, criterion: "Presence" },
            { id: 2, criterion: "Flow" },
            { id: 3, criterion: "Rhymes" },
            { id: 4, criterion: "Complexity" },
            { id: 5, criterion: "Articulation" },
            { id: 6, criterion: "Creativity" },
            { id: 7, criterion: "Versatility" },
            { id: 8, criterion: "Depth" },
            { id: 9, criterion: "Hits" },
            { id: 10, criterion: "Performance" },
        ],
        rapper1Grade: null,
        rapper2Grade: null,
    };

    startBattle = () => {
        this.setState({
            isInfo: false,
            isRapper1: true,
        });
    };

    passTheMic = (grade) => {
        this.setState({
            isRapper1: false,
            isRapper2: true,
            rapper1Grade: grade,
        });
    };

    dropTheMic = (grade) => {
        this.setState({
            isRapper2: false,
            isResults: true,
            rapper2Grade: grade,
        });
    };

    backToBattles = (rapper1Grade, rapper2Grade, winner) => {
        // THIS IS WHERE YOU'LL POST THE GRADES AND SCORES AND SHIT

        let newGrade1 = {
            grade: rapper1Grade.toString(),
            rapper_id: this.state.battle.rapper1_id.toString(),
        };

        let newGrade2 = {
            grade: rapper2Grade.toString(),
            rapper_id: this.state.battle.rapper2_id.toString(),
        };

        axios.post(API_URL + "/grades", newGrade1).then((response) => {
            console.log(response);
        });

        axios.post(API_URL + "/grades", newGrade2).then((response) => {
            console.log(response);
        });
    };

    componentDidMount = () => {
        let selectedBattleId = this.props.match.params.battleId;

        axios.get(API_URL + "/battles").then((response) => {
            let battles = response.data;

            let foundBattle = battles.find(
                (battle) => battle.id === parseInt(selectedBattleId)
            );

            this.setState({
                battle: foundBattle,
            });
        });

        axios.get(API_URL + "/battles/rapper-data").then((response) => {
            let token = response.data;
            let header = {
                Authorization: "Bearer" + " " + token,
                "Content-Type": "application/json",
            };

            axios
                .get(
                    SPOTIFY_URL +
                        `q=artist:${this.state.battle.rapper1_name}` +
                        `&type=artist`,
                    {
                        headers: header,
                    }
                )
                .then((response) => {
                    this.setState({
                        rapper1: response.data.artists.items[0],
                    });
                });

            axios
                .get(
                    SPOTIFY_URL +
                        `q=artist:${this.state.battle.rapper2_name}` +
                        `&type=artist`,
                    {
                        headers: header,
                    }
                )
                .then((response) => {
                    this.setState({
                        rapper2: response.data.artists.items[0],
                        isRapperInfoLoading: false,
                    });
                });
        });
    };

    render() {
        const {
            battle,
            rapper1,
            rapper2,
            isRapperInfoLoading,
            isInfo,
            isRapper1,
            isRapper2,
            isResults,
            criteria,
            rapper1Grade,
            rapper2Grade,
        } = this.state;

        return (
            <>
                {isInfo === true && (
                    <main className="battle">
                        <h1 className="battle__heading">WHO'S DA ILLEST?</h1>
                        <h2 className="battle__name">{battle.name}</h2>
                        {isRapperInfoLoading === true ? (
                            <h3 className="battle__loading">loading</h3>
                        ) : (
                            <div className="battle__rapper-info-container">
                                <RapperInfo rapper={rapper1} />
                                {/* <h4 className="battle__vs">VS</h4> */}
                                <RapperInfo rapper={rapper2} />
                            </div>
                        )}
                        <button
                            className="battle__button"
                            onClick={this.startBattle}
                        >
                            YO DJ! START THE BATTLE!
                        </button>
                    </main>
                )}

                {isRapper1 === true && (
                    <main className="battle">
                        <h1 className="battle__heading">WHO'S DA ILLEST?</h1>
                        <GradeRapper
                            rapper={rapper1}
                            criteria={criteria}
                            buttonText={"PASS THE MIC!"}
                            click1={this.passTheMic}
                            isRapper1={true}
                        />
                    </main>
                )}

                {isRapper2 === true && (
                    <main className="battle">
                        <h1 className="battle__heading">WHO'S DA ILLEST?</h1>
                        <GradeRapper
                            rapper={rapper2}
                            criteria={criteria}
                            buttonText={"DROP THE MIC!"}
                            click2={this.dropTheMic}
                            isRapper1={false}
                        />
                    </main>
                )}

                {isResults === true && (
                    <main className="battle">
                        <h1 className="battle__heading">WHO'S DA ILLEST?</h1>
                        <Results
                            rapper1={rapper1}
                            rapper2={rapper2}
                            rapper1Grade={rapper1Grade}
                            rapper2Grade={rapper2Grade}
                            battle={battle}
                            click3={this.backToBattles}
                        />
                    </main>
                )}
            </>
        );
    }
}
