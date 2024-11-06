import  Block  from '../../Components/Block';

export default function Test() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Block initialPosition={{ x: 10, y: 10 }} initialSize={{ width: 30, height: 20 }}>
            Hello World
      </Block>
    </div>
  )
}
