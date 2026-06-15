import * as WebBrowser from "expo-web-browser";
import { TouchableOpacity } from "react-native";

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
}

export function ExternalLink({ href, children }: ExternalLinkProps) {
  return (
    <TouchableOpacity
      onPress={async () => {
        await WebBrowser.openBrowserAsync(href);
      }}
    >
      {children}
    </TouchableOpacity>
  );
}
