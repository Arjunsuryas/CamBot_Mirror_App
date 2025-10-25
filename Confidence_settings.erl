-module(confidence_settings).
-export([
    threshold_color/1,
    threshold_label/1,
    example_usage/0
]).

%% Determine color based on confidence threshold
threshold_color(Threshold) when Threshold >= 80 ->
    red;
threshold_color(Threshold) when Threshold >= 60 ->
    yellow;
threshold_color(Threshold) when Threshold >= 40 ->
    green;
threshold_color(_) ->
    blue.

%% Determine label based on confidence threshold
threshold_label(Threshold) when Threshold >= 80 ->
    "Very High";
threshold_label(Threshold) when Threshold >= 60 ->
    "High";
threshold_label(Threshold) when Threshold >= 40 ->
    "Medium";
threshold_label(_) ->
    "Low".

%% Example usage
example_usage() ->
    Threshold = 75,
    Color = threshold_color(Threshold),
    Label = threshold_label(Threshold),
    io:format("Threshold: ~p, Color: ~p, Label: ~s~n", [Threshold, Color, Label]).
