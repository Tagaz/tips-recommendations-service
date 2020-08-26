import React from 'react';
import ReactDOM from 'react-dom';

import WhatToOrder from './WhatToOrder.jsx';
import InsiderTip from './InsiderTip.jsx';
import KnownFor from './KnownFor.jsx';
import ZagatMentions from './ZagatMentions.jsx';

import axios from 'axios';
import styled from 'styled-components';

const port = 6070;

const StyledContainer = styled.div`
  width: 70%;
  max-width: 900px;
  height: auto;
  padding: 0 24px 40px 24px;
  margin-top: 40px;
  font-family: Roboto, "Helvetica Neue", sans-serif;
`;

const StyledTitles = styled.h3`
  padding-top: 33px;
  color: #656666;
  font-size: 16px;
  letter-spacing: .086em;
  text-transform: uppercase;
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantName: '',
      dishName1: '',
      dishImage1: '',
      dishName2: '',
      dishImage2: '',
      dishName3: '',
      dishImage3: '',
      tip: '',
      features: '',
      tags: '',
      articles: '',
    };
  }

  componentDidMount() {
    let self = this;
    axios.get(`http://localhost:3003/api/tips/${window.location.pathname.substring(1, window.location.pathname.length - 1)}`)
    .then(function (response) {
      const data = response.data[0];
      self.setState({
        restaurantName: data.restaurant_name,
        dishName1: data.dish_name1,
        dishImage1: data.dish_image1,
        dishName2: data.dish_name2,
        dishImage2: data.dish_image2,
        dishName3: data.dish_name3,
        dishImage3: data.dish_image3,
        tip: data.tip,
        features: data.features,
        tags: data.tags,
      });
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      self.fetchArticles();
    });
  }

  fetchArticles() {
    let self = this;
    const restaurantTags = self.state.tags.split(',');

    axios.get(`http://localhost:3003/api/articles` + window.location.pathname.substring(0, window.location.pathname.length - 1))

    .then(function (articles) {
      articles.data.map((article) => {
        const articleTags = article.tags.split(',')
        for (var i = 0; i < articleTags.length; i++) {
          if (restaurantTags.indexOf(articleTags[i] !== -1 && articles.data.indexOf(article) === -1)) {
            console.log(article)
            self.setState({
              articles: article
            })
          }
        }
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    return (
    <StyledContainer>
      <section id='what-to-order'>
        <StyledTitles>WHAT TO ORDER</StyledTitles>
        <WhatToOrder dishName1 = {this.state.dishName1} dishImage1 = {this.state.dishImage1} dishName2 = {this.state.dishName2} dishImage2 = {this.state.dishImage2} dishName3 = {this.state.dishName3} dishImage3 = {this.state.dishImage3}/>
      </section>

      <section id='insider-tip'>
        <StyledTitles>INSIDER TIP</StyledTitles>
        <InsiderTip tip = {this.state.tip}/>
      </section>

      <section id='known-for'>
        <StyledTitles>KNOWN FOR</StyledTitles>
        <KnownFor features = {this.state.features} />
      </section>

      <section id='articles'>
        <StyledTitles>ZAGAT MENTIONS OF {this.state.restaurantName}</StyledTitles>
        <ZagatMentions articles = {this.state.articles} />
      </section>
    </StyledContainer>
    );
  }
}

export default App;