import React, { useState } from "react";

export default function test() {
  const cards = [
    { name: "kevin hart", category: ['standup'] },
    { name: "street food festival", category: ['food']  },
    { name: "KR - Valur", category: ['sports'] },
  ];

  const [renderedCards, setRenderedCards] = useState(cards);

  const filter = { names: ["kevin hart"] };


  const filterArray = (category) => {
      let tempCards = renderedCards
      console.log('tempCards :>> ', tempCards);
      cards.filter((card) => {
          if (card.category.includes(category)) {
              cards.splice(cards.indexOf(card))
            }
        }
        )
}


  return (
    <div>
        <button onClick={()=> {
            filterArray('food')
        }}>log</button>
      {renderedCards.map((card) => (
        <h1>{card.name}</h1>
      ))}
    </div>
  );
}
