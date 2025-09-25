import MobileMenu from './mobileMenu'

export default function Header(){
	return(
		<>		
		<div className="
		font-[Closeness_Fonts]
		justify-between
		align
		flex
		flex-row
		px-8
		lg:px-50
		py-8
		
		" >
			<div>
				<h2 className="">
					Abi Samsoe
				</h2>
			</div>
			<div className="
			lg:items-center
			lg:flex
			lg:flex-row
			lg:gap-10
			hidden
			lg:block
			" >
				<div className="cursor-pointer" >
					Home
				</div>
				<div className="cursor-pointer" >
					Contact
				</div>
				<div className="cursor-pointer" >
					Else
				</div>
			</div>
			<div
			className="
			block
			lg:hidden
			cursor-pointer			
			"
			>
			<MobileMenu />
			</div>			
		</div>				
		</>
	)
}