
import { IoStar } from "react-icons/io5"
import classNames from "@/app/controladores/utilities/classNames"


export default function Stars({ rating = 0, label = "" }: { rating: number, label: string }) {
    return (
        <div className="flex items-center">
                  <div>
                    <div className="flex items.center">
                      {[0, 1, 2, 3, 4].map((item) => (
                            <IoStar 
                              key={item}
                              className={classNames(
                                rating > item ? "text-yellow-400" : 'text-gray-300',
                                'h-5, w-5 flex-shrink-0 text-lg'
                              )}
                              aria-hidden="true"
                              />
                          ))
                      }
                      <p className="ml-2 text-base text-terciary">{label} </p>
                    </div>
                  </div>
    </div>
    )
}