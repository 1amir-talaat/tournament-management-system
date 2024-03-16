import { CardContent, CardFooter, Card } from "@/components/ui/card";

import { Avatar } from "@chakra-ui/react";

export default function Top3Participants({ data }) {
  return (
    <>
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-6">
        <div className="text-center text-2xl font-semibold py-4">Top 3 Participants</div>
        <div className="flex justify-center space-x-6">
          <div className="flex flex-col items-center">
            <div className="pt-16"></div>
            <Avatar src="https://bit.ly/broken-link" />
            <div className="mt-2 font-semibold">{data[0].name}</div>
            <div className="flex items-center mt-1">
              <StarIcon className="text-yellow-400" />
              <span className="ml-1">{data[0].points}</span>
            </div>
            <Card className="mt-4 w-[150px]">
              <CardContent className="flex items-center justify-center pt-4">
                <TrophyIcon className="text-gray-400" />
                <span className="text-4xl text-gray-400">2</span>
              </CardContent>
              <CardFooter className="bg-gray-200">
                <div className="text-center " style={{ paddingBottom: "151px" }}></div>
              </CardFooter>
            </Card>
          </div>
          <div className="flex flex-col items-center">
            <CrownIcon className="text-yellow-400" />
            <Avatar src="https://bit.ly/broken-link" />
            <div className="mt-2 font-semibold">{data[1].name}</div>
            <div className="flex items-center mt-1">
              <StarIcon className="text-yellow-400" />
              <span className="ml-1">{data[1].points}</span>
            </div>
            <Card className="mt-4 w-[150px] bg-yellow-300">
              <CardContent className="flex items-center justify-center  pt-4">
                <TrophyIcon className="text-yellow-500" />
                <span className="text-4xl text-yellow-500">1</span>
              </CardContent>
              <CardFooter className="bg-yellow-200">
                <div className="text-center" style={{ paddingBottom: "194px" }}></div>
              </CardFooter>
            </Card>
          </div>
          <div className="flex flex-col items-center">
            <div style={{ paddingTop: "90px" }}></div>
            <Avatar src="https://bit.ly/broken-link" />

            <div className="mt-2 font-semibold">{data[2].name}</div>
            <div className="flex items-center mt-1">
              <StarIcon className="text-yellow-400" />
              <span className="ml-1">{data[2].points}</span>
            </div>
            <Card className="mt-4 w-[150px] bg-orange-300">
              <CardContent className="flex items-center justify-center  pt-4">
                <TrophyIcon className="text-orange-500" />
                <span className="text-4xl text-orange-500">3</span>
              </CardContent>
              <CardFooter className="bg-orange-200">
                <div className="text-center py-16"></div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

function CrownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}

function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function TrophyIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
