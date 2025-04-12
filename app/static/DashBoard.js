import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
export const HomeBanner =()=>{
    const shinyBgStyle = {
        width: '100vw',
        height: 'auto',
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(to right, #da4453, #89216b)`,
        backgroundSize: '300% 300%',
        animation: 'gradientShift 10s linear infinite',
      };
    
      const shineEffectStyle = {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-50%',
        width: '200%',
        height: '100%',
        background:
          'linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)',
        animation: 'shineMove 3s linear infinite',
        zIndex: 1,
        pointerEvents: 'none',
      };

    return (
        <div className="flex flex-col overflow-x-hidden justify-between items-start w-full px-[20px] py-[20px] my-[30px] container rounded-lg bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300  " >
  <div style={shineEffectStyle}></div>
  <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }

          @keyframes shineMove {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
            <h1 className="text-4xl font-bold text-white">Welcome to Prezify</h1>
            <p className="mt-4 text-mdMohit9313#123
             text-white">Check out our latest blogs and tutorials to learn how Prezify helps personalize your website, enhance user engagement, and boost conversions. Discover how to track user behavior in real-time and deliver tailored content that truly resonates with your audience.</p>
            <button className="mt-6 px-4 py-2 bg-white text-[#000000] rounded-lg hover:bg-gray-200 transition duration-300">
                Get Started
            </button>
        </div>
    );
}

export const BlogLists = () => {
  const getRandomDarkGradient = () => {
    const darkColors = [
    
      '#a55eea', // deep steel 
    ];
    
    
  
    const color1 = darkColors[Math.floor(Math.random() * darkColors.length)];
    const color2 = darkColors[Math.floor(Math.random() * darkColors.length)];
    return `linear-gradient(135deg, ${color1}, ${color2})`;
  };
const blogList = [ 
  {
    _id: '1',
    projectName: 'How Add Create Projects',
    discription: 'Learn how to create projects in Prezify and start with personalization',
    createdBy: { username: 'User 1' },
  },
  {
    _id: '2',
    projectName: 'How Add Create Projects',
    discription: 'Learn how to create projects in Prezify and start with personalization',
    createdBy: { username: 'User 2' },
  },
  {
    _id: '3',
    projectName: 'How Add Create Projects',
    discription: 'Learn how to create projects in Prezify and start with personalization',
    createdBy: { username: 'User 3' },
  },
  {
    _id: '4',
    projectName: 'How Add Create Projects',
    discription: 'Learn how to create projects in Prezify and start with personalization',
    createdBy: { username: 'User 4' },
  }]
  return (
  <div className="w-full px-[0] flex py-[20px] flex-col justify-start container">
   <h3 className="text-[30px] font-bold my-[15px]">Recommended Blogs for Setup</h3>
  <ul className="flex flex-wrap w-full">
{blogList.length && (

blogList.map((blog) => (
  
  <li key={blog._id} className="w-1/4 p-2 box-border">
    <Card style={{ background: getRandomDarkGradient(), color: '#ffffff' }}>
      <CardHeader>
        <CardTitle>{blog.projectName}</CardTitle>
        <CardDescription className="text-[#ffffff]">{blog.discription}</CardDescription>
      </CardHeader>
    
      <CardFooter className="flex justify-between items-center">
        <p className="text-sm">
          <strong>By:</strong> {blog?.createdBy?.username}
        </p>
        <Link
          className="bg-white rounded-lg px-4 text-sm text-black py-2"
          href={`/dashboard/`}
        >
          View Blog
        </Link>
      </CardFooter>
    </Card>
  </li>
))
)}
</ul>

 
  <br />
</div>)

}