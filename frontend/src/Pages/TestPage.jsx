import Block from "../Components/Block"

export default function TestPage() {
  return <>
    <div style={{ width: "100vw", height: "100vh", position: "relative", border: "1px solid #ddd" }}>
      <h2>TestPage</h2>
      {/* Text Block */}
      <Block
        initialWidth={500} initialHeight={190} initialX={150} initialY={205} styles={{ backgroundColor: "lightblue" }}
        
      ><p>Text Block</p></Block>
    </div>
  </>
}
