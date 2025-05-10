import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-client";

interface Props {
  postId: number;
}

interface Vote {
  id: number;
  post_id: number;
  user_id: string;
  vote: number; // 1 for like, -1 for dislike
}

const vote = async (voteValue: number, postId: number, userId: string) => {
  const { data: existingVote, error: fetchError } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError) throw new Error(fetchError.message);

  if (existingVote) {
    if (existingVote.vote === voteValue) {
      const { error: deleteError } = await supabase
        .from("votes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId);
      if (deleteError) throw new Error(deleteError.message);
      return null;
    } else {
      const { error: updateError } = await supabase
        .from("votes")
        .update({ vote: voteValue })
        .eq("post_id", postId)
        .eq("user_id", userId);
      if (updateError) throw new Error(updateError.message);
      return null;
    }
  } else {
    const { data, error } = await supabase
      .from("votes")
      .insert({ vote: voteValue, post_id: postId, user_id: userId });
    if (error) throw new Error(error.message);
    return data;
  }
};

const fetchVotes = async (postId: number): Promise<Vote[]> => {
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId);

  if (error) throw new Error(error.message);
  return data as Vote[];
};

export const LikeButton = ({ postId }: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: votes,
    isLoading,
    error,
  } = useQuery<Vote[], Error>({
    queryKey: ["votes", postId],
    queryFn: () => fetchVotes(postId),
  });

  const { mutate } = useMutation({
    mutationFn: (voteValue: number) => {
      if (!user) throw new Error("User not logged in");
      return vote(voteValue, postId, user.id);
    },
    onSuccess: () => {
      // Refresh vote count on success
      queryClient.invalidateQueries({ queryKey: ["votes", postId] });
    },
  });

  if (isLoading) return <div>Loading votes...</div>;
  if (error) return <div>Error loading votes: {error.message}</div>;

  const likes = votes?.filter((v) => v.vote === 1).length || 0;
  const dislikes = votes?.filter((v) => v.vote === -1).length || 0;

  return (
    <div className="flex flex-col gap-2 mt-2 text-center">
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => mutate(1)}
          className="px-3 py-1 bg-green-200 rounded hover:bg-green-300"
        >
          👍 {likes}
        </button>
        <button
          onClick={() => mutate(-1)}
          className="px-3 py-1 bg-red-200 rounded hover:bg-red-300"
        >
          👎 {dislikes}
        </button>
      </div>
    </div>
  );
};
