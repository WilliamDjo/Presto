import  Slide  from '../../Components/Slide';

export default function Test() {
  return (
    <div style={{ width: '100%', height: '500px', position: 'relative' }}>
      <Slide initialPosition={{ x: 10, y: 10 }} initialSize={{ width: 30, height: 20 }}>
            Hello World
      </Slide>
    </div>
  )
}
