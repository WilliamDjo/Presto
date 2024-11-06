import  Slide  from '../../Components/Slide';

export default function Test() {
  return (
    <div>
      <Slide initialPosition={{ x: 10, y: 10 }} initialSize={{ width: 30, height: 20 }}>
            Hello World
      </Slide>
    </div>
  )
}
