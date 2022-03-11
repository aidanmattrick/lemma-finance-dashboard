import streamlit as st
import pandas as pd
import numpy as np
import plotly.figure_factory as ff
from plotly.subplots import make_subplots
import plotly.graph_objects as go
import plotly.express as px

USDL_df = pd.read_parquet('data/results/viz_df_daily_03-10-22.parquet')
rebalance_df = pd.read_parquet('data/results/viz_rebalance_df_daily_03-11-22.parquet')



#***********************
#TVL VIZ
#***********************

TVL_fig = px.line(USDL_df, y='tvl_USD',
             labels={'timestamp':'Time',
                     'tvl_USD':'TVL (USD)'
                    }
            )

TVL_fig.update_layout(
                  title = '<b>Total Value Locked in Lemma (USD)</b>',
                  title_x = 0.5,
                  height = 400, width = 1000,
    
                 )
#TVL_fig.show()

#***********************
#USDL IN CIRCULATION VIZ
#***********************

USDL_fig = make_subplots(rows = 2, cols = 1, 
                    row_heights=[0.6, 0.4],
                    subplot_titles=('USDL in Circulation',  'Mint vs. Redemption Events'),
                    vertical_spacing=0.15,
)

# Set y2_axes to be dyanmic in response to values
# y2_min = min(balance_df_daily.redeem_events*-1)*3
# y2_max = max(balance_df_daily.mint_events) * 2.5

#USDL IN CIRCULATION:
USDL_fig.add_trace(
    go.Scatter(x=USDL_df.index, y=USDL_df['USDL_minted'], name = 'USDL in Circulation'
                       ), 
)


#MINT VS REDEMPTION EVENTS:
#Mint Events
USDL_fig.add_trace(
    go.Bar(x=USDL_df.index, y=USDL_df.mint_events, name="Mints", legendgroup = '2', marker_color='#00cc96'),
    row = 2, col = 1
)

#Redemption Events
USDL_fig.add_trace(
    go.Bar(x=USDL_df.index, y=USDL_df.redeem_events*-1, name="Redemptions", legendgroup='2', marker_color='#ef553b'),
    row = 2, col =1
)



USDL_fig['layout']['yaxis1']['title']= 'USDL'
USDL_fig['layout']['yaxis2']['title']= 'Number of Events'
#fig['layout']['yaxis2']['title']= 'Ratio of Mints/Redeem Events'
#fig['layout']['yaxis2']['range']= [y2_min, 40]

USDL_fig.update_layout(barmode='relative',
                  title = '<b>USDL in Circulation with Corresponding Mints and Redemptions</b>',
                  title_x = 0.5,
                  height=700, width=1000,
                  legend_tracegroupgap = 390,
                 )
#USDL_fig.show()

#********************
#REBALANCE EVENTS VIZ
#********************

rebalance_fig = make_subplots(rows = 1, cols = 1)

#MINT VS REDEMPTION EVENTS:
#Mint Events
rebalance_fig.add_trace(
    go.Bar(x=rebalance_df.index, y=rebalance_df.amount_USD_mint, name="Mint USDL", marker_color='#00cc96'),
    row = 1, col = 1
)

#Redemption Events
rebalance_fig.add_trace(
    go.Bar(x=rebalance_df.index, y=rebalance_df.amount_USD_redeem, name="Burn USDL", marker_color='#ef553b'),
    row = 1, col =1
)


rebalance_fig['layout']['yaxis']['title']= 'Amount rebalanced (USD)'

rebalance_fig.update_layout(barmode='relative',
                  title = '<b>Rebalance Events</b>',
                  title_x = 0.5,
                  height=400, width=1000,
                 )
#rebalance_fig.show()

###Markdown to remove whitespace
# Remove whitespace from the top of the page and sidebar
# e1tzin5v4
# st.markdown("""
#         <style>
#                .css-1n76uvr  {
#                     padding-top: 0rem;
#                     padding-bottom: 0rem;
#                 }
#         </style>
#         """, unsafe_allow_html=True)

###PLOTS

st.markdown("<h1 style='text-align: center; color: black;'>Lemma Finance</h1>", unsafe_allow_html=True)


with st.container():
    st.plotly_chart(TVL_fig, use_container_width=True)

st.plotly_chart(USDL_fig, use_container_width=True)

st.plotly_chart(rebalance_fig, use_container_width=True)



# title_alignment =
# """
# <style>
# #Lemma Finance {
#   text-align: center
# }
# </style>
# """
# st.markdown(title_alignment, unsafe_allow_html=True)
