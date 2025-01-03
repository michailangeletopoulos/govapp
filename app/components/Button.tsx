import Image from "next/image";
 {/* ? giati mporei kapoia koumpia na mhn exoun icon */}
type ButtonProps = { 
    type: 'button' | 'submit';
    title: string;
    icon?: string;     
    variant: 'btn_dark_green'
} 
{/* afou xrhsimopoio typescript tha prepei na oriso to buttonprops ti eidous metablhtes pernei */}
const Button = ({type, title, icon, variant }: ButtonProps) => {    
  return (
    <button className={'flexCenter gap-3 rounded-full border ${variant}'}  type={type}>
        {icon && <Image src={icon} alt="title" width={24} height={24}/>} {/* an yparxei to icon sto button */}
        <label className="whitespace-nowrap">{title}</label>
    
    </button>
  )
}

export default Button