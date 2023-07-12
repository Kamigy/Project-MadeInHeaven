import { useParams } from "react-router-dom";

export default function Post() {
    const {postID} = useParams()
   console.log ("post", postID)
    return (
        <div>
            this is a post with ID test   {postID}
        </div>
    )


}