import myPhoto from "./images/me-without-background.png";

import { ReactComponent as Arrow } from "./images/icons/arrow.svg";
import { ReactComponent as Star } from "./images/icons/star.svg";

const skills = [
  { name: "JavaScript", rank: 5 },
  { name: "CSS", rank: 4 },
  { name: "HTML", rank: 5 },
  { name: "React", rank: 4.5 },
];

function Home() {
  return (
    <main className='main-page-wrapper'>
      <div className='welcome-section-wrapper row space-around'>
        <div className='my-photo-wrapper'>
          <div className='my-photo'>
            <img
              className='my-photo-img'
              src={myPhoto}
              alt='myself looking sideways with forest in the background'
            />
          </div>
        </div>
        <div className='welcome-section'>
          <h4 className='mono'>Welcome to my personal website</h4>
          <h1>
            <b>
              Hello, I'm <span className='color-emphasis'>Andrei Fedchenko</span>
            </b>
          </h1>
          <h2 className='color-down'>Software Developer</h2>
          <p>
            I'm Toronto-based junior fullstack software developer with
            web-development being my forte. However, I am also a fan of game
            development as it provides a lot of fun challenges.
          </p>
          <a className='link-button' href='#about'>
            <span className='link-button-text'>MORE ABOUT ME </span>
            <span className='link-button-arrow'>
              <Arrow />
            </span>
          </a>
        </div>
      </div>
      <hr />
      <div className='about-section'>
        <div id='about' />
        <h1 className='color-emphasis about-header'>About me</h1>
        <div className='row align-flex-start'>
          <div className='wrapper about-general'>
            <h3 className='about-subheader about-subheader-list'>Personal</h3>
            <ul className='about-general-list'>
              <li>
                <b>First Name: </b>
                <span>Andrei</span>
              </li>
              <li>
                <b>Last Name: </b>
                <span>Fedchenko</span>
              </li>
              <li>
                <b>Age: </b>
                <span>
                  {new Date(new Date() - new Date("11/01/2001")).getUTCFullYear() -
                    1970}
                </span>
              </li>
              <li>
                <b>City: </b>
                <span>Toronto, Canada</span>
              </li>
            </ul>
          </div>
          <hr className='hide-desktop' />
          <div className='about-education'>
            <h3 className='about-subheader'>Education</h3>
            <span className='about-education-dates'>2019 - 2021</span>
            <span className='about-education-gpa'>3.8 GPA</span>
            <h4 className='about-education-degree'>
              Associates degree
              <span className='color-down'> - Seneca College</span>
            </h4>
            <p className='about-education-description'>
              Successfully completed Computer Programming and Analysis program, which
              provided me great practice and knowledge about software development and
              project management.
            </p>
          </div>
        </div>
        <hr />
        <div className='row align-flex-start' style={{width: "100%"}}>
          <div className='wrapper about-contacts'>
            <h3 className='about-subheader about-subheader-list'>Contacts</h3>
            <ul className='about-contacts-list'>
              <li>
                <b>Email: </b>
                <a href='mailto:fedprog01@gmail.com'>fedprog01@gmail.com</a>
              </li>
              <li>
                <b>LinkedIn: </b>
                <a href='https://www.linkedin.com/in/andreifed/'>
                  linkedin.com/in/andreifed
                </a>
              </li>
              <li>
                <b>Github: </b>
                <a href='https://github.com/Wh1teNinja'>github.com/Wh1teNinja</a>
              </li>
            </ul>
          </div>
          <hr className='hide-desktop' />
          <div className='wrapper about-skills'>
            <h3 className='about-subheader about-subheader-list'>Skills</h3>
            <ul className='skills-list'>
              {skills.map((skill) => (
                <li className='skill'>
                  <span className='skill-name'>{skill.name}</span>
                  <span className='skill-rank'>
                    {(() => {
                      let stars = [];
                      for (let i = 0; i < skill.rank; i++) {
                        stars.push(<Star className='skill-rank-star' />);
                      }

                      if (Math.floor(skill.rank) < skill.rank)
                        stars.push(<span className='half-star-block' />);
                      return stars;
                    })()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
