import {useUser} from "../layout/LayoutMain";
import ProfilePage from "../pages/ProfilePage";

export function Component() {
    const { user } = useUser()
    return <ProfilePage user={user}/>
}